const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: { type: String, require: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActivated: { type: Boolean, default: false },
  activationLink: String,
});

module.exports = model("User", userSchema);
