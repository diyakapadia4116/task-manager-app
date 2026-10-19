// Validation middleware for auth routes
const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body || {};

  if (!name || typeof name !== "string" || !name.trim()) {
    return res.status(400).json({ success: false, error: "Name is required" });
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ success: false, error: "Please provide a valid email address" });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return res.status(400).json({
      success: false,
      error: "Password must be at least 6 characters"
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({ success: false, error: "Email is required" });
  }

  if (!password || typeof password !== "string" || !password.trim()) {
    return res.status(400).json({ success: false, error: "Password is required" });
  }

  next();
};

module.exports = { validateRegister, validateLogin };
