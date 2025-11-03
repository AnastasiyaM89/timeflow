const mongoose = require("mongoose");
const roles = require("../constants/roles");

const userSchema = mongoose.Schema(
  {
    login: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: /[^\s@]+@[^\s@]+\.[^\s@]+/,
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown",
      lowercase: true,
    },
    role: {
      type: Number,
      default: roles.USER,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

module.exports = User;
