const bcrypt = require("bcrypt");
const User = require("../models/User");
const { generate } = require("../helpers/token");
const ROLES = require("../constants/roles");

async function register(login, password) {
  if (!password) {
    throw new Error("Password is empty");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ login, password: passwordHash });

  const token = generate({ id: user._id.toString() });

  const responseUser = {
    _id: user._id,
    username: user.login,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    gender: user.gender,
  };

  return { token, user: responseUser };
}

async function login(login, password) {
  const user = await User.findOne({ login });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Wrong password");
  }

  const token = generate({ id: user._id.toString() });

  const responseUser = {
    _id: user._id,
    username: user.login,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    gender: user.gender,
  };

  return { token, user: responseUser };
}

function getUsers() {
  return User.find();
}

function getRoles() {
  return [
    { id: ROLES.ADMIN, name: "Admin" },
    { id: ROLES.USER, name: "User" },
  ];
}

function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

function updateUser(id, userData) {
  return User.findByIdAndUpdate(id, userData, { new: true });
}

module.exports = {
  register,
  login,
  getUsers,
  getRoles,
  deleteUser,
  updateUser,
};
