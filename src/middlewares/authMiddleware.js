const jwt = require("jsonwebtoken");
const { isBlackListed } = require("../services/authService");

module.exports = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extrai o token após "Bearer"

    if (token && !(await isBlackListed(token))) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded) {
          res.locals.token = decoded;
          return next();
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  res.status(401).json({
    status: "error",
    message: "Unauthorized",
    error: {
      name: "JsonWebTokenError",
      message: "Invalid or not provided token",
    },
  });
};
