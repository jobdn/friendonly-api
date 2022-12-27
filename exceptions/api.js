module.exports = class ApiError extends Error {
  // TODO: why do ulbi use class properties here?
  /**
   * status
   * error
   */

  constructor(status, message, errors = []) {
    super(message);

    this.status = status;
    this.errors = errors;
  }

  static NotAuthorizedError() {
    return new ApiError(401, "User not authorized.");
  }
  static BadRequestError(message, errors = []) {
    return new ApiError(400, message, errors);
  }
};
