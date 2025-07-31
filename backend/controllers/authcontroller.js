import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import bcrypt from "bcryptjs";

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email" });

    const checkpass = await bcrypt.compare(password, user.password);
    if (!checkpass)
      return res.status(400).json({ message: "Invalid credentials" });

    // a token for purpose
    const token = jwt.sign({purpose:"login"}, process.env.JWT_SECRET_KEY, {
      expiresIn: "5m",
    });
    // res.cookie("auth_token", token, {
    //   httpOnly: true,
    //   maxAge: 5 * 60 * 1000,
    //   sameSite: "Strict",
    // });

    return res.status(200).json({
      message: "Login successful",
      user: {
        username: user.username,
        email: user.email,
        token,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { username, fullname, email, password, confirmpassword } = req.body;

    if (await User.findOne({ username }))
      return res.status(400).json({ message: "Username already taken" });

    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already taken" });

    if (password !== confirmpassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullname,
      email,
      password: hashpassword,
    });

    await newUser.save();
    
    return res.status(201).json({
      message: "Signup successful",
      user: {
        username,
        fullname,
        email,
      },
    });

  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// LOGOUT
export const logout = async (req, res) => {
   res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  return res.status(200).json({ message: "Logout successful" });
};



// RESET PASSWORD
export const reset = async (req, res) => {
  try {
    const { email, newpassword } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "No user found" });

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newpassword, salt);

    await User.findByIdAndUpdate(user._id, { password: newHash }, { new: true });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};


