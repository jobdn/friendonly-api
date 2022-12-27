const UserModel = require("../models/user");

class UserService {
  async getAllUsers() {
    const users = await UserModel.find();
    return users;
  }
}

module.exports = new UserService();
