const ApiError = require("../exceptions/api");

module.exports = (err, req, res, next) => {
  console.error(err);

  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }

  res.status(500).json({ message: "Something went wrong on the server." });
};
