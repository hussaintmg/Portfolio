const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {

  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
     console.log("authMiddleware: verify error:", err.message);
    res.status(401).json({ message: "Token is invalid" });
  }
};

module.exports = authMiddleware;
