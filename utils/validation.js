const { validationResult } = require("express-validator");
const ApiError = require("../exceptions/api");

module.exports = {
  checkValidationResult(req, exception) {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const errors = result.array();
      throw ApiError.BadRequestError(exception, errors);
    }
  },
};
