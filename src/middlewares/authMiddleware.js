const jwt = require("jsonwebtoken");
const { isBlackListed } = require("../services/authService");
const { client } = require("../redis");
const ApiResponse = require("../utils/ApiResponse");

module.exports = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return ApiResponse.error(
      res,
      "Unauthorized",
      {
        name: "JsonWebTokenError",
        message: "Token not provided",
      },
      401
    );
  }

  const token = authHeader.split(" ")[1];

  if (!token || (await isBlackListed(token))) {
    return ApiResponse.error(
      res,
      "Unauthorized",
      {
        name: "JsonWebTokenError",
        message: "Invalid or blacklisted token",
      },
      401
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const activeToken = await client.get(`active_token_${decoded.id}`);

    if (token !== activeToken) {
      return ApiResponse.error(
        res,
        "Unauthorized",
        {
          name: "JsonWebTokenError",
          message: "Token does not match the active session",
        },
        401
      );
    }

    res.locals.token = decoded;

    return next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return ApiResponse.error(
      res,
      "Unauthorized",
      {
        name: error.name,
        message: error.message,
      },
      401
    );
  }
};
