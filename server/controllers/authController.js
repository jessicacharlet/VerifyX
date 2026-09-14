const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { ensureDbConnected } = require("../utils/dbConnect");

const inMemoryUsers = new Map();

const generateToken = (id) => {
  return jwt.sign({ id: String(id) }, process.env.JWT_SECRET || "verimark_jwt_secret_key_2026_secure_hash_authentication", {
    expiresIn: "30d",
  });
};

const getInMemoryUser = (idOrEmail) => {
  return inMemoryUsers.get(String(idOrEmail).toLowerCase()) || null;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const isDbReady = await ensureDbConnected();

    const { name, email, password, confirmPassword, role, companyName, walletAddress } = req.body;

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
    const requestedRole = role ? role.trim().toUpperCase() : "MANUFACTURER";

    let existingUser = null;
    if (isDbReady) {
      try {
        existingUser = await User.findOne({ email: emailClean });
      } catch (e) {}
    }
    if (!existingUser) {
      existingUser = inMemoryUsers.get(emailClean);
    }

    if (existingUser) {
      return res.status(400).json({ success: false, message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    let newUser = null;
    if (isDbReady) {
      try {
        newUser = await User.create({
          name: name.trim(),
          email: emailClean,
          passwordHash,
          role: requestedRole,
          companyName: companyName ? companyName.trim() : "",
          walletAddress: walletAddress ? walletAddress.trim() : "",
        });
      } catch (dbErr) {
        console.warn("⚠️ User DB Creation warning, storing in fallback memory:", dbErr.message);
      }
    }

    if (!newUser) {
      const fallbackId = "usr_" + Date.now().toString(36) + "_" + Math.random().toString(36).substr(2, 5);
      newUser = {
        _id: fallbackId,
        id: fallbackId,
        name: name.trim(),
        email: emailClean,
        passwordHash,
        role: requestedRole,
        companyName: companyName ? companyName.trim() : "",
        walletAddress: walletAddress ? walletAddress.trim() : "",
        createdAt: new Date(),
      };
      inMemoryUsers.set(emailClean, newUser);
      inMemoryUsers.set(String(fallbackId), newUser);
    } else {
      inMemoryUsers.set(emailClean, newUser);
      inMemoryUsers.set(String(newUser._id), newUser);
    }

    const userId = newUser._id || newUser.id;
    const token = generateToken(userId);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: (newUser.role || "MANUFACTURER").toLowerCase(),
        companyName: newUser.companyName || "",
        walletAddress: newUser.walletAddress || "",
        createdAt: newUser.createdAt,
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
    const isDbReady = await ensureDbConnected();

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password." });
    }

    const emailClean = email.trim().toLowerCase();
    let user = null;

    if (isDbReady) {
      try {
        user = await User.findOne({ email: emailClean });
      } catch (e) {}
    }

    if (!user) {
      user = inMemoryUsers.get(emailClean);
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    let isMatch = false;
    if (typeof user.matchPassword === "function") {
      isMatch = await user.matchPassword(password);
    } else if (user.passwordHash) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const userId = user._id || user.id;
    const token = generateToken(userId);

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
        role: (user.role || "USER").toLowerCase(),
        companyName: user.companyName || "",
        walletAddress: user.walletAddress || "",
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
    const isDbReady = await ensureDbConnected();
    let user = null;

    if (req.user) {
      user = req.user;
    } else if (isDbReady) {
      try {
        user = await User.findById(req.user._id).select("-passwordHash");
      } catch (e) {}
    }

    if (!user && req.user?.id) {
      user = inMemoryUsers.get(String(req.user.id));
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: (user.role || "USER").toLowerCase(),
        companyName: user.companyName || "",
        walletAddress: user.walletAddress || "",
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

module.exports = { registerUser, loginUser, getMe, logoutUser, getInMemoryUser };
