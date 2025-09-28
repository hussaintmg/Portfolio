const nodemailer = require("nodemailer");
const crypto = require("crypto");
const User = require("../models/user");

const sendAuthLink = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email" });

    const token = crypto.randomBytes(15).toString("hex");
    const verifyUrl = `${process.env.REACT_API_URL}/confirm-auth/${token}`;

    user.authToken = token;
    user.authTokenExpiry = Date.now() + 15 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Confirm Authentication",
      html: `
        <h2>Confirm Your Account</h2>
        <p>Click below to verify your account:</p>
        <a href="${verifyUrl}" 
           style="display:inline-block;padding:10px 15px;background:#3283eb;color:#fff;text-decoration:none;border-radius:5px;">
          Confirm Now
        </a>
        <p>This link will expire in 15 minutes.</p>
      `,
    });

    res.json({ message: "Authentication link sent" });
  } catch (err) {
    console.error("Auth Link Error:", err.message);
    res.status(500).json({ message: "Failed to send auth link" });
  }
};

module.exports = sendAuthLink;
