"use strict";
require("dotenv").config();
const bcrypt = require("bcrypt");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_PASSWORD, 10);
    await queryInterface.bulkInsert("Users", [
      {
        name: process.env.DEFAULT_NAME,
        email: process.env.DEFAULT_EMAIL,
        password: hashedPassword,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
