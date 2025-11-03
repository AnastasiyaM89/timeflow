const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const { date } = req.query;

    let filterQuery = { author: userId };

    if (date) {
      const targetDate = new Date(date);
      if (isNaN(targetDate)) {
        return res.status(400).json({ message: "Некорректный формат даты" });
      }

      filterQuery.$and = [
        { dateStart: { $lte: targetDate } },
        { dateEnd: { $gte: targetDate } },
      ];
    }

    const tasks = await Task.find(filterQuery);
    res.json({ tasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Некорректный ID пользователя",
      });
    }

    const task = new Task({
      ...req.body,
      author: new mongoose.Types.ObjectId(userId),
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (err) {
    console.error("Error creating task:", err);

    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Ошибка валидации: " + err.message,
      });
    }

    res.status(400).json({ message: err.message });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const taskId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Некорректный ID задачи" });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    if (!task.author.equals(new mongoose.Types.ObjectId(req.user.id))) {
      return res.status(403).json({
        message: "У вас нет прав на обновление этой задачи",
      });
    }

    const { title, category } = req.body;
    if (!title || !category) {
      return res.status(400).json({
        message: "Обязательны поля: title, category",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedTask);
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Серверная ошибка" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    if (!task.author.equals(userId)) {
      return res
        .status(403)
        .json({ message: "У вас нет прав на удаление этой задачи" });
    }

    await Task.findByIdAndDelete(taskId);
    res.status(204).send();
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
