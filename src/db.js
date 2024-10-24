const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PWD,
  {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    logging: false,
  }
);

// Testar a conexão com o banco de dados
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Database connection successful!");
  } catch (error) {
    console.error("Unable to connect to database:", error);
  }
}

module.exports = { sequelize, testConnection };
