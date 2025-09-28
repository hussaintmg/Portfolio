const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const authMiddleware = require("../middlewares/authMiddleware");
const sendEmail = require("../controllers/sendEmail");
const sendAuthLink = require("../controllers/sendAuthLink");

const cookieOptions = (remember) => ({
  httpOnly: true,
  secure: false,
  sameSite: "lax",
  ...(remember && { maxAge: 15 * 24 * 60 * 60 * 1000 }),
});

router.post("/register", async (req, res) => {
  try {
    let { username, email, password, remember } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail)
      return res.status(400).json({ message: "Email already exists" });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "Username already exists" });

    let role = "user";
    if (password.startsWith(process.env.ADMIN_CODE)) {
      password = password.slice(6);
      role = "admin";
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      authenticated: false,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.cookie("token", token, cookieOptions(remember));

    res.json({
      message: "Registered successful",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password, remember } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid Username" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong Password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.cookie("token", token, cookieOptions(remember));

    res.json({
      message: "Login successful",
      user: { username: user.username, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/forgot-password", sendEmail);

router.post("/verify-token", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ message: "Token required", isValid: false });
    }

    const user = await User.findOne({ resetToken: token });
    if (!user) {
      return res.status(400).json({ message: "Invalid token", isValid: false });
    }

    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Token expired", isValid: false });
    }

    return res.status(200).json({ message: "Token is valid", isValid: true });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", isValid: false, error: err.message });
  }
});
router.post("/reset-password", async (req, res) => {
  try {
    const { password, token } = req.body;
    if (!token)
      return res
        .status(400)
        .json({ message: "Token required", isValid: false });

    const user = await User.findOne({ resetToken: token });
    if (!user)
      return res.status(400).json({ message: "Invalid token", isValid: false });

    if (user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Token expired", isValid: false });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: "Password Changed Successfully",
      passwordChanges: true,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", isValid: false, error: err.message });
  }
});

router.post("/send-auth-link", sendAuthLink);

router.get("/confirm-auth/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ authToken: token });
    if (!user) return res.status(400).json({ message: "Invalid token" });

    if (user.authTokenExpiry < Date.now()) {
      return res.status(400).json({ message: "Token expired" });
    }

    user.authenticated = true;
    user.authToken = null;
    user.authTokenExpiry = null;
    await user.save();

    res.json({ message: "User authenticated successfully" ,user});
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.log("Auth:" + err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
