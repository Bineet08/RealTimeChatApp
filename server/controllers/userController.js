import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(400).json({ success: false, message: "Missing details" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    // token
    const token = generateToken(newUser._id);

    const userSafe = newUser.toObject();
    delete userSafe.password;

    return res.status(201).json({
      success: true,
      userData: userSafe,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password required" });
    }

    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(userData._id);
    const userSafe = userData.toObject();
    delete userSafe.password;

    return res.status(200).json({
      success: true,
      userData: userSafe,
      token,
      message: "Logged in successfully",
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
