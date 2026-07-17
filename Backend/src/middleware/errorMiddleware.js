const errorMiddleware = (err, req, res, next) => {
  //jwt expired
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "sastion expired please login again",
    });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token.",
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate field value entered.",
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    message,
  });
};
module.exports = errorMiddleware;
