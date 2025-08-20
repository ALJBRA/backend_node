const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API",
      version: "1.0.0",
      description: "Documentação da API",
    },
    servers: [
      {
        url: process.env.API_URL || "http://localhost:3001",
        description: "Servidor de desenvolvimento",
      },
    ],
  },
  apis: ["./docs/docsApi.js"], // Caminho dos arquivos que contêm as anotações Swagger
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app) {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
