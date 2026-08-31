const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "verimark_jwt_secret_key_2026_secure_hash_authentication");

      req.user = await User.findById(decoded.id).select("-passwordHash");

      if (!req.user) {
        return res.status(401).json({ success: false, message: "User account no longer exists." });
      }

      return next();
    } catch (error) {
      console.error("JWT Auth error:", error.message);
      return res.status(401).json({ success: false, message: "Not authorized, token validation failed." });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized, missing authentication token." });
  }
};

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "verimark_jwt_secret_key_2026_secure_hash_authentication");
      req.user = await User.findById(decoded.id).select("-passwordHash");
    } catch (e) {
      // Continue without user
    }
  }
  next();
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized." });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized for this operation.`,
      });
    }
    next();
  };
};

module.exports = { protect, optionalAuth, authorize };
