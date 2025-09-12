const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  usermail: String,
  password: String,
  level: Number
});

module.exports = mongoose.model("User", userSchema, "colUser");
// --> apontando para a collection colUser
