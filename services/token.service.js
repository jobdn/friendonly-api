const jwt = require("jsonwebtoken");

const RefreshTokenModel = require("../models/refresh-token");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "10d",
    });

    return { accessToken, refreshToken };
  }

  async saveRefreshToken(userId, refreshToken) {
    const existToken = await RefreshTokenModel.findOne({ userId });
    if (existToken) {
      existToken.token = refreshToken;
      existToken.save();

      return;
    }

    const token = await RefreshTokenModel.create({
      user: userId,
      token: refreshToken,
    });

    return token;
  }

  async removeRefreshToken(refreshToken) {
    const res = await RefreshTokenModel.findOneAndRemove({
      token: refreshToken,
    });

    return res;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
      return userData;
    } catch (error) {
      return null;
    }
  }

  async findOne(token) {
    const tokenFromDb = await RefreshTokenModel.findOne({ token });
    return tokenFromDb;
  }
}
module.exports = new TokenService();
