const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  authToken: { type: String },
  authTokenExpiry: { type: Date },
  authenticated: { type: Boolean, required: true },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin"],
    default: "user",
  },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
});

module.exports = mongoose.model("User", userSchema);
