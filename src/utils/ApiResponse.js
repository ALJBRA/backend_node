class ApiResponse {
  static success(res, message, data = {}, status = 200) {
    return res.status(status).json({
      status: "success",
      message,
      data,
    });
  }

  static error(res, message, error = {}, status = 400) {
    return res.status(status).json({
      status: "error",
      message,
      error,
    });
  }
}

module.exports = ApiResponse;
