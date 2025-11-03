const mongoose = require("mongoose");
const User = require("../models/User");
const { verify } = require("../helpers/token");

module.exports = async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Нет токена, авторизация отклонена" });
    }

    const match = authHeader.match(/^Bearer\s+(.*)$/i);
    if (!match) {
      return res.status(401).json({ message: "Неверный формат токена" });
    }
    const token = match[1];

    const decoded = verify(token);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ message: "Неверные данные токена" });
    }

    if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
      return res
        .status(401)
        .json({ message: "Неверный формат ID пользователя." });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Пользователь не найден" });
    }
    req.user = user;

    next();
  } catch (err) {
    if (err.message === "Invalid token") {
      return res.status(401).json({ message: "Недействительный токен" });
    }
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
  }
};
