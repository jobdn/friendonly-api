const { Schema, model } = require("mongoose");

const refreshTokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  token: { type: String, required: true },
});

module.exports = model("Refresh-token", refreshTokenSchema);
