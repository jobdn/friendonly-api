module.exports = class UserDto {
  email;
  id;
  name;
  isActivated;

  constructor(model) {
    this.email = model.email;
    this.id = model._id;
    this.name = model.name;
    this.isActivated = model.isActivated;
  }
};
