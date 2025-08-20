module.exports = (error, req, res, next) => {
  console.error(error);
  res.status(500).json({ status: "error", message: "Internal Server Error" });
};
