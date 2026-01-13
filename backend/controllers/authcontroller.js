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
//signup
export const signup = async (req, res) => {
  try {
    const { username, fullname, email, password, confirmpassword, verificationToken } = req.body;

    // 1. SECURITY CHECK: Verify the token
    if (!verificationToken) {
        return res.status(401).json({ message: "Verification missing. Please verify OTP first." });
    }
    try {
        const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET_KEY);
        if (decoded.purpose !== "verified_signup" || decoded.email !== email) {
            return res.status(403).json({ message: "Invalid verification token." });
        }
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired verification token." });
    }

    // 2. Standard Checks
    if (await User.findOne({ username }))
      return res.status(400).json({ message: "Username already taken" });

    // (Optional: Email check is redundant here if OTP checked it, but good for safety)
    if (await User.findOne({ email }))
      return res.status(400).json({ message: "Email already taken" });

    if (password !== confirmpassword)
      return res.status(400).json({ message: "Passwords do not match" });

    // 3. Create User
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
      user: { username, fullname, email },
    });

  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};


// RESET PASSWORD
export const reset = async (req, res) => {
  try {
    const { email, newpassword, verificationToken } = req.body;

    // 1. SECURITY CHECK: Verify the token
    if (!verificationToken) {
        return res.status(401).json({ message: "Verification missing." });
    }
    try {
        const decoded = jwt.verify(verificationToken, process.env.JWT_SECRET_KEY);
        if (decoded.purpose !== "verified_reset" || decoded.email !== email) {
            return res.status(403).json({ message: "Invalid verification token." });
        }
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired verification token." });
    }

    // 2. Update Password
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "No user found" });

    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(newpassword, salt);

    await User.findByIdAndUpdate(user._id, { password: newHash }, { new: true });

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error resetting password", error: error.message });
  }
};

