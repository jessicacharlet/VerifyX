const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { ensureDbConnected } = require("../utils/dbConnect");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "verimark_jwt_secret_key_2026_secure_hash_authentication", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    await ensureDbConnected();

    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide full name, email, and password." });
    }

    if (confirmPassword && password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Password and Confirm Password do not match." });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
    }

    const emailClean = email.trim().toLowerCase();
    const userExists = await User.findOne({ email: emailClean });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: emailClean,
      passwordHash,
      role: "USER",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error during user registration." });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    await ensureDbConnected();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error during login." });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    await ensureDbConnected();

    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("GetMe Error:", error.message);
    return res.status(500).json({ success: false, message: "Server error fetching user profile." });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};

module.exports = { registerUser, loginUser, getMe, logoutUser };
