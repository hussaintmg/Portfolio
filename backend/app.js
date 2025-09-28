const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homePage");
const skillRoutes = require("./routes/skillRoutes");
const projectRoutes = require("./routes/ProjectsRoute");
const ConectedDB = require("./config/db");
const path = require("path");
dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.REACT_API_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.REACT_API_URL);
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/home", homeRoutes);
app.use("/api/skill", skillRoutes);
app.use("/api/projects", projectRoutes);

ConectedDB();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
