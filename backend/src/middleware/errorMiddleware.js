function notFound(req, res) {
  res.status(404).json({ message: "Not found" });
}

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = Number(err.statusCode || err.status || (res.statusCode !== 200 ? res.statusCode : 500));
  const safeStatus = Number.isFinite(statusCode) && statusCode >= 400 ? statusCode : 500;

  if (safeStatus >= 500) {
    console.error(`[api] ${req.method} ${req.originalUrl}`, err);
  }

  res.status(safeStatus).json({
    message:
      safeStatus >= 500 && process.env.NODE_ENV === "production"
        ? "Server Error"
        : err.message || "Server Error",
  });
}

module.exports = {
  notFound,
  errorHandler,
};
