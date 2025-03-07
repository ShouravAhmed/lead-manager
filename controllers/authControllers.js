import otpService from "../services/otpService.js";
import userService from "../services/userService.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const sendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    otpService.sendOtp(email);
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
    
    if (!await otpService.verifyOtp(email, otp)) {
      return res.status(400).json({ message: "Invalid OTP or OTP Expired" });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    if (await userService.getUserByProperties({username}) || await userService.getUserByProperties({email})) {
      return res.status(400).json({ message: "Username or email already exists" });
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

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
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
    const accesstoken = generateToken(user);
    res.status(200).json({ message: "User logged in successfully", user, accesstoken });
  } 
  catch (error) {
    res.status(400).json({ message: error.message });
  }
}
