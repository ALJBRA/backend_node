const { z } = require("zod");
const ApiResponse = require("../utils/ApiResponse");

const handleError = (res, error, statusCode = 500) => {
    if (error instanceof z.ZodError) {
        // 🔥 Formatar erros do Zod
        const formattedErrors = error.errors.map(err => ({
            path: err.path.join("."),
            message: err.message,
        }));

        return ApiResponse.error(res, "Validation failed", formattedErrors, 400);
    }

    // 🔥 Erros de chave única (Sequelize)
    if (error.name === "SequelizeUniqueConstraintError") {
        const field = error.errors[0]?.path || "unknown_field";
        return ApiResponse.error(res, "Duplicate entry", `The ${field} is already in use.`, 409);
    }

    // 🔥 Tratamento para outros erros da aplicação
    return ApiResponse.error(res, "An error occurred", error.message, statusCode);
};

module.exports = { handleError };