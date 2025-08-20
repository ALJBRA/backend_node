const jwt = require("jsonwebtoken");
const { isBlackListed } = require("../services/authService");
const { client } = require('../redis');

module.exports = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (authHeader) {
    const token = authHeader.split(" ")[1];

    if (token && !(await isBlackListed(token))) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded) {
          const activeToken = await client.get(`active_token_${decoded.id}`);

          // Verifique se o token do Redis é igual ao token fornecido
          if (token === activeToken) {
            res.locals.token = decoded;
            return next(); // O token é válido, continue com o middleware
          } else {
            return res.status(401).json({
              status: "error",
              message: "Unauthorized",
              error: {
                name: "JsonWebTokenError",
                message: "Invalid or not provided token",
              },
            });
          }
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
