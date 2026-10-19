const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware: protect routes — verify Bearer JWT token
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      error: "Not authorized — no token provided"
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach user (without password) to request
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: "Not authorized — token is invalid or expired"
    });
  }
};

module.exports = { protect };
