const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router({ mergeParams: true });
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  try {
    const user = await User.findOne({ login });
    if (!user)
      return res.status(400).json({ message: "Пользователь не найден" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Неверный пароль" });

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({
      token: token,
      user: {
        _id: user._id,
        username: user.login,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: err.message || "Внутренняя ошибка сервера" });
  }
});

router.post("/register", async (req, res) => {
  const { login, password } = req.body;
  if (!login || !password) {
    return res.status(400).json({ message: "Логин и пароль обязательны." });
  }
  try {
    const existingUser = await User.findOne({ login });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Пользователь с таким логином уже существует." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ login, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id.toString(), role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(201).json({
      message: "Пользователь создан",
      user: {
        _id: user._id,
        username: user.login,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gender: user.gender,
      },
      token: token,
    });
  } catch (err) {
    console.error("Ошибка при регистрации:", err);

    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Пользователь с таким логином уже существует" });
    }

    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Ошибка сервера при регистрации" });
  }
});

router.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Успешно вышли из системы" });
});

router.put("/profile", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  if (!userId) {
    return res.status(400).json({ message: "ID пользователя не найден" });
  }

  const updatedUserData = req.body;

  delete updatedUserData.password;
  delete updatedUserData.role;
  delete updatedUserData._id;
  delete updatedUserData.id;
  delete updatedUserData.login;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Пользователь не найден для обновления" });
    }

    res.json({
      message: "Профиль обновлен успешно",
      user: {
        _id: updatedUser._id,
        username: updatedUser.login || updatedUser.username,
        role: updatedUser.role,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        gender: updatedUser.gender,
      },
    });
  } catch (err) {
    console.error(`EDIT PROFILE error for user ${userId}:`, err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Ошибка сервера при обновлении профиля" });
  }
});

module.exports = router;
