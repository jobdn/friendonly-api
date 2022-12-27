const { authService } = require("../services");
const { checkValidationResult } = require("../utils/validation");

const TEN_DAYS = 10 * 24 * 60 * 60 * 1000;

class AuthController {
  async registration(req, res, next) {
    try {
      checkValidationResult(req, "Error while user registration.");

      const { email, password, name } = req.body;
      const userData = await authService.registerUser(email, password, name);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: TEN_DAYS,
        httpOnly: true,
      });

      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async activate(req, res, next) {
    try {
      const { link } = req.params;
      await authService.activateUserBy(link);
      res.redirect(302, `${process.env.CLIENT_URL}/login`);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      checkValidationResult(req, "Error while user login.");

      const { email, password } = req.body;

      const userData = await authService.login(email, password);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: TEN_DAYS,
        httpOnly: true,
      });

      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      await authService.logout(refreshToken);
      res.clearCookie("refreshToken");
      res.status(200).send();
    } catch (error) {
      next(error);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await authService.refresh(refreshToken);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: TEN_DAYS,
        httpOnly: true,
      });

      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
