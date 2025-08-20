const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const swaggerUi = require("swagger-ui-express");
const setupSwagger = require("../docs/swagger");

const app = express();

// Middlewares de configuração
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Rotas de autenticação
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});
app.use("/auth", authRoutes);

// Rota para exibir a documentação no navegador
setupSwagger(app);

// Middleware de tratamento de erros
app.use(errorMiddleware);

module.exports = app;
