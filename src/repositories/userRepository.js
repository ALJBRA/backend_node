const User = require("../models/User");

const createUser = async (data) => {
  return await User.create(data);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

const findUserById = async (id) => {
  return await User.findByPk(id);
};

const saveResetToken = async (userId, token) => {
  return await User.update({ resetToken: token }, { where: { id: userId } });
};

const updatePassword = async (userId, newPassword) => {
  return await User.update(
    { password: newPassword },
    { where: { id: userId } }
  );
};

const updateEmailVerifiedAt = async (userId) => {
  return await User.update(
    { emailVerifiedAt: new Date() },
    { where: { id: userId } }
  );
};

const deleteToken = async (userId) => {
  return await User.update({ resetToken: null }, { where: { id: userId } });
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  saveResetToken,
  updatePassword,
  updateEmailVerifiedAt,
  deleteToken,
};
