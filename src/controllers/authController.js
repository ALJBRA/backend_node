const authService = require("../services/authService");
const ApiResponse = require("../utils/ApiResponse");
const UserDTO = require("../dtos/UserDTO");
const { handleError } = require("../utils/errorHandler");

const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    return ApiResponse.success(
      res,
      "User registered successfully",
      new UserDTO(user),
      201
    );
  } catch (error) {
    return handleError(res, error);
  }
};

const login = async (req, res) => {
  try {
    const token = await authService.login(req.body);
    return ApiResponse.success(res, "Login successful", { token });
  } catch (error) {
    return handleError(res, error);
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    await authService.verifyEmail(token);

    return ApiResponse.success(res, "E-mail verified successfully");
  } catch (error) {
    return handleError(res, error);
  }
};

const profile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const user = await authService.getAuthenticatedUser(token);
    return ApiResponse.success(
      res,
      "User authenticated successfully",
      new UserDTO(user)
    );
  } catch (error) {
    return ApiResponse.error(res, "Unauthorized", error, 401);
  }
};

const forgetPassword = async (req, res) => {
  try {
    await authService.forgetPassword(req.body);
    return ApiResponse.success(res, "Email sent successfully");
  } catch (error) {
    return handleError(res, error);
  }
};

const resetPassword = async (req, res) => {
  const { token } = req.query;
  const { newPassword } = req.body;

  try {
    // Chama o serviço para redefinir a senha
    await authService.resetPassword(token, newPassword);

    return ApiResponse.success(res, "Password updated successfully");
  } catch (error) {
    return handleError(res, error);
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const id = res.locals.token.id;
    await authService.logout(token, id);
    return ApiResponse.success(res, "Logged out successfully");
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  profile,
  forgetPassword,
  resetPassword,
  logout,
};
