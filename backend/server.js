require("dotenv").config();

const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes");

const port = 3001;
const app = express();

const corsOptions = {
  origin: process.env.DB_CONNECTION_STRING,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());

app.use("/api", routes);

app.use(express.static(path.resolve("..", "frontend", "dist")));

app.get(/\/.*/, (req, res) => {
  res.sendFile(path.resolve("..", "frontend", "dist", "index.html"));
});

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
  console.log("MongoDB connected");
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
});
