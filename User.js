const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  usermail: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  level: { type: Number, default: 0 } // 0 = comum, 1 = admin
});

module.exports = mongoose.model("User", UserSchema);
