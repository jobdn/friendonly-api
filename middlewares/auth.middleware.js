const ApiError = require("../exceptions/api");
const tokenService = require("../services/token.service");

module.exports = function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(ApiError.NotAuthorizedError());
    }

    const accessToken = authHeader.split(" ")[1];
    if (!accessToken) return next(ApiError.NotAuthorizedError());

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) return next(ApiError.NotAuthorizedError());

    req.user = userData;
    next();
  } catch (error) {
    next(ApiError.NotAuthorizedError());
  }
};
