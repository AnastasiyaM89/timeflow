const express = require("express");
const router = express.Router({ mergeParams: true });

router.use("/categories", require("./categoryRoutes"));

router.use("/tasks", require("./taskRoutes"));

router.use("/", require("./authRoutes"));

module.exports = router;
