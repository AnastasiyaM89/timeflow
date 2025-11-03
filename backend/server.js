require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const routes = require("./routes");
const path = require("path");

const port = 3001;
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.static("../frontend/build"));
app.use(express.json());
app.use(cookieParser());

app.use("/", routes);

mongoose.connect(process.env.DB_CONNECTION_STRING).then(() => {
  console.log("MongoDB connected");
  app.listen(3001, "0.0.0.0", () => {
    console.log("Server listening on http://0.0.0.0:3001");
  });
});
