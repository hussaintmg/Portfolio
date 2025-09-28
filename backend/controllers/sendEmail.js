const nodemailer = require("nodemailer");
const crypto = require("crypto");  
const User = require("../models/user");

const sendEmail = async (req, res) => {
  try {
    const { username, stateAsU } = req.body;
    let user;
    if (stateAsU) {
      user = await User.findOne({ username });
      if (!user) return res.status(400).json({ message: "Invalid Username" });
    } else {
      user = await User.findOne({ email: username });
      if (!user) return res.status(400).json({ message: "Invalid Email" });
    }
    const token = crypto.randomBytes(15).toString("hex");
    const verifyUrl = `${process.env.REACT_API_URL+"/reset-password/"+token}`;

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
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
      subject: "Password Reset Link",
      html: `
    <p style="font-size: 1.2rem;">
      Click 
      <a href="${verifyUrl}" 
         style="cursor: pointer; text-decoration: none; color: rgb(52, 128, 235);">
        here
      </a> 
      to reset your password.
    </p>
  `,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to send email", error: err.message });
  }
};

module.exports = sendEmail;
