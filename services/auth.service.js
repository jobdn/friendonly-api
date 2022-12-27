const { hash, compare } = require("bcrypt");
const { v4 } = require("uuid");

const mailService = require("./mail.service");
const tokenService = require("./token.service");

const ApiError = require("../exceptions/api");
const { UserDto } = require("../dtos");

const UserModel = require("../models/user");

class AuthService {
  async registerUser(email, password, name) {
    const candidate = await UserModel.findOne({ email });
    if (candidate)
      throw ApiError.BadRequestError("User with this email already exists");

    // Create a user
    const hashedPassword = await hash(password, 3);
    const activationLink = v4();
    const user = await UserModel.create({
      name,
      email,
      password: hashedPassword,
      activationLink,
    });

    // Send mail to the created user
    await mailService.sendActivationMail(
      email,
      `${process.env.SERVER_URL}/auth/activate/${user.activationLink}`
    );

    // Generate tokens
    // TODO: DRY
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async activateUserBy(link) {
    const existentUser = await UserModel.findOne({ activationLink: link });

    if (!existentUser)
      throw ApiError.BadRequestError("There is not such user!!!");

    existentUser.isActivated = true;
    await existentUser.save();
  }

  async login(email, password) {
    const existentUser = await UserModel.findOne({ email });
    if (!existentUser)
      throw ApiError.BadRequestError("User with this email wasn't find.");

    const isEqual = await compare(password, existentUser.password);
    if (!isEqual) throw ApiError.BadRequestError("Invalid password.");

    // TODO: DRY
    const userDto = new UserDto(existentUser);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    await tokenService.removeRefreshToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.NotAuthorizedError();
    }

    const userData = tokenService.validateRefreshToken(refreshToken);
    const existentToken = await tokenService.findOneRefreshToken(refreshToken);

    if (!userData || !existentToken) {
      throw ApiError.NotAuthorizedError();
    }
    // TODO: DRY
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}

module.exports = new AuthService();
