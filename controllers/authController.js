import otpService from "../services/otpService.js";
import userService from "../services/userService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    otpService.sendOtp(email, 10);
    res.status(200).json({ message: `OTP sent to ${email}` });
  } 
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

const isStrongPassword = (password) => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const register = async (req, res, next) => {
  try {
    const { email, otp, username, password, confirm_password } = req.body;
    const _username = username.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    if (password !== confirm_password) {
      return res.status(422).json({ message: "Passwords do not match" });
    }
    if (!isStrongPassword(password)) {
      return res.status(422).json({ message: "Password is not strong enough" });
    }
    if (await userService.getUserByProperties({username: _username}) || await userService.getUserByProperties({email})) {
      return res.status(409).json({ message: "Username or email already exists" });
    }
    if (!await otpService.verifyOtp(email, otp)) {
      return res.status(400).json({ message: "Invalid OTP or OTP Expired" });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const _password = await bcrypt.hash(password, salt);

    const user = await userService.createUser({ email, username: _username, password: _password });
    res.status(201).json({success: true, message: "User registered successfully", user});
  } 
  catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "User registration failed", error: error});
  }
}

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.REFRESH_TOKEN_SECRET, 
    { expiresIn: "24h" }
  );
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await userService.getUserByUsernameOrEmail(username);
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    const accessToken = generateAccessToken(user);
    
    const refreshToken = generateRefreshToken(user);
    otpService.saveToken(user.username, refreshToken, 1440);

    res.status(200).json({ message: "User logged in successfully", user, accessToken, refreshToken });
  } 
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password, confirm_password } = req.body;
    
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }
    if (!await otpService.verifyOtp(email, otp)) {
      return res.status(400).json({ message: "Invalid OTP or OTP Expired" });
    }

    // hash user password
    const salt = await bcrypt.genSalt(10);
    const _password = await bcrypt.hash(password, salt);

    const user = await userService.getUserByUsernameOrEmail(email);
    user.password = _password;
    user.save();
    
    res.status(201).json({success: true, message: "password reset successfully", user});
  } 
  catch (error) {
    console.log(error);
    res.status(400).json({success: false, message: "User registration failed", error: error});
  }
}

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: "Invalid refresh token" });
    }

    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const token = await otpService.findToken(user.username);
    if (token !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user);
    res.status(200).json({ message: "Token refreshed successfully", accessToken });
  } 
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const logout = async (req, res) => {
  try {
    await otpService.deleteToken(req.user.username);
    res.status(200).json({ message: "User logged out successfully" });
  } 
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export const getUser = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.status(200).json({ message: "User fetched successfully", user });
  } 
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}