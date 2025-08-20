const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const userRepository = require("../repositories/userRepository");
const {
  registerValidation,
  loginValidation,
  forgetPasswordValidation,
} = require("../validations/authValidations");
const { client } = require('../redis');

let blackListedTokens = [];

const register = async (data) => {
  const validatedData = registerValidation.parse(data);
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);
  return await userRepository.createUser({
    ...validatedData,
    password: hashedPassword,
  });
};

const login = async (data) => {
  const validatedData = loginValidation.parse(data);
  const user = await userRepository.findUserByEmail(validatedData.email);

  if (!user || !(await bcrypt.compare(validatedData.password, user.password))) {
    throw new Error("Invalid email or password");
  }

  const expiresIn = process.env.JWT_EXPIRES
    ? parseInt(process.env.JWT_EXPIRES, 10)
    : 86400;

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });

  await client.del(`active_token_${user.id}`);
  await client.set(`active_token_${user.id}`, token);

  return token;
};

const getAuthenticatedUser = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return await userRepository.findUserById(decoded.id);
};

const forgetPassword = async (data) => {
  const validatedData = forgetPasswordValidation.parse(data);
  const user = await userRepository.findUserByEmail(validatedData.email);
  if (!user) {
    throw new Error("User not found");
  }

  // Gerar um token JWT para redefinição de senha
  const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  // Salvar o token no banco de dados
  await userRepository.saveResetToken(user.id, resetToken);

  // Criar o link de redefinição de senha
  const resetLink = `${process.env.BASE_URL}/auth/reset-password?token=${resetToken}`;

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });

  const mailOptions = {
    from: "no-reply@example.com",
    to: validatedData.email,
    subject: "Password Reset",
    text: `Follow this link to reset your password: ${resetLink}`,
    html: `<p>Follow this link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
  };

  await transporter.sendMail(mailOptions);
};

const resetPassword = async (token, newPassword) => {
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }

  const user = await userRepository.findUserById(decoded.userId);

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.resetToken || user.resetToken !== token) {
    throw new Error("This reset link is no longer valid");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await userRepository.updatePassword(user.id, hashedPassword);

  await userRepository.deleteToken(user.id);

};

const logout = async (token, id = null) => {
  await client.del(`active_token_${id}`);
  blackListedTokens.push(token);
};

const isBlackListed = async (token) => {
  return blackListedTokens.includes(token);
};

module.exports = {
  register,
  login,
  getAuthenticatedUser,
  forgetPassword,
  resetPassword,
  logout,
  isBlackListed,
};
