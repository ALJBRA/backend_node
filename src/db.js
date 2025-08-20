const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    dialect: process.env.MYSQL_DIALECT,
    host: process.env.MYSQL_HOST,
    logging: false,
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
}

module.exports = { sequelize, testConnection };
