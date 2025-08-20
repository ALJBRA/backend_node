const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const emailQueue = require("../services/email/queue");
const userRepository = require("../repositories/userRepository");
const {
  registerValidation,
  loginValidation,
  forgetPasswordValidation,
} = require("../validations/authValidations");
const { client } = require("../redis");

let blackListedTokens = [];

const register = async (data) => {
  const validatedData = registerValidation.parse(data);
  const verifyEmailExists = await userRepository.findUserByEmail(
    validatedData.email
  );
  if (verifyEmailExists) {
    throw new Error("The email is already in use");
  }
  const hashedPassword = await bcrypt.hash(validatedData.password, 10);
  const user = await userRepository.createUser({
    ...validatedData,
    password: hashedPassword,
  });

  // 🔑 Gerar token de validação
  const emailToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token expira em 1 hora
  });

  // Salvar o token no banco de dados
  await userRepository.saveResetToken(user.id, emailToken);

  const verificationLink = `${process.env.FRONT_URL}/auth/verify-email?token=${emailToken}`;

  // ✉️ Adicionar job para envio do e-mail de verificação
  if (process.env.SEND_EMAIL_ENABLED) {
    await emailQueue.add(
      "sendEmail",
      {
        to: user.email,
        subject: "Confirme seu e-mail",
        text: `Clique no link para validar seu e-mail: ${verificationLink}`,
      },
      { attempts: 3, backoff: 5000 }
    );
  }

  return user;
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

const verifyEmail = async (token) => {
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
    throw new Error("This link is no longer valid");
  }

  await userRepository.updateEmailVerifiedAt(user.id);

  await userRepository.deleteToken(user.id);
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
  const resetLink = `${process.env.FRONT_URL}/auth/reset-password?token=${resetToken}`;

  // 🔥 Adiciona o e-mail na fila para processamento assíncrono
  if (process.env.SEND_EMAIL_ENABLED) {
    await emailQueue.add(
      "sendEmail",
      {
        to: validatedData.email,
        subject: "Password Reset",
        text: `Follow this link to reset your password: ${resetLink}`,
      },
      { attempts: 3, backoff: 5000 }
    );
  }
};

const verifyTokenResetPassword = async (token) => {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
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
  verifyEmail,
  getAuthenticatedUser,
  forgetPassword,
  verifyTokenResetPassword,
  resetPassword,
  logout,
  isBlackListed,
};
