const express = require("express");
require("express-async-errors");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

// Middlewares de configuração
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

// Rotas de autenticação
app.use("/auth", authRoutes);

// Middleware de tratamento de erros
app.use(errorMiddleware);

module.exports = app;
