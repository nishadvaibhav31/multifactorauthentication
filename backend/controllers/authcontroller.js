import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import bcrypt, { genSalt } from "bcryptjs";

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(401).json({ message: "please fill all field " });
  const user = await User.findOne({email});

  if (!user) return res.status(400).json({ message: "invalid email" });
  const checkpass = await bcrypt.compare(password, user.password);
  if (!checkpass)
    return res.status(400).json({ message: "invalid credentials" });
  // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
  //   expiresIn: "5m",
  // });
  // res.cookie("auth_token", token, {
  //   httpOnly: true,
  //   maxAge: 5 * 60 * 1000,
  //   sameSite: "Strict",
  });
  return res.status(200).json({
    message: "login successfully",
    user: {
      username:user.email,
      email: user.email,
    },
  });
};
export const signup = async (req, res) => {
  const { username, fullname, email, password, confirmpassword } = req.body;

  if (await User.findOne({ username }))
    return res.status(400).json({ message: "username already taken" });
  if (await User.findOne({ email }))
    return res.status(400).json({ message: "email already taken" });
  if (password !== confirmpassword)
    return res.status(400).json({ message: "password doesn't match" });
 
    
  const salt = await bcrypt.genSalt(10);
  const hashpassword = await bcrypt.hash(password, salt);
  const newUser = new User({
    username,
    fullname,
    email,
    password: hashpassword,
  });
 
  await newUser.save();
  const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "5m",
  });
  res.cookie("auth_token", token, {
    httpOnly: true,
    maxAge: 5 * 60 * 1000,
    sameSite: "Strict",
  });
  return res.status(201).json({
    message: "signup successfull",
    user: {
      username,
      fullname,
      email,
    },
  });

  res.status(200).json({message:"generate otp for signup",user: {
    username,
    fullname,
    email,
  },})


};

export const logout = async (req, res) => {
  res.clearCookie("auth_token");

  return res.status(200).json({ message: "logout successfully" });

};
export const change = async (req, res) => {
  const { username, password, newpassword } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "no user found " });
  const ismatch = await bcrypt.compare(password, user.password);
  if (!ismatch)
    return res.status(400).json({ message: "incorrect credentials" });
  if (password === newpassword)
    return res.status(400).json({ message: "please enter new password" });
  const salt = await bcrypt.genSalt(10);
  const newhashpass = await bcrypt.hash(newpassword, salt);

  try {
    const updateuser = await User.findByIdAndUpdate(
      user._id,
      {
        password: newhashpass,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ message: "reset succesfully" });
  } catch (error) {
    console.log(error.message);
  }
};
export const reset = async (req, res) => {
  const { email, newpassword } = req.body;
  const user = await User.findOne({email});
  if (!user) return res.status(400).json({ message: "no user found " });

  const salt = await bcrypt.genSalt(10);
  const newhashpass = await bcrypt.hash(newpassword, salt);

  try {
    const updateuser = await User.findByIdAndUpdate(
      user._id,
      {
        password: newhashpass,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({ message: "reset succesfully" });
  } catch (error) {

  }
};
export const deleteuser = async (req, res) => {
  const {username} = req.body;

  try {
  const user= await User.findOneAndRemove({username:username});
    if(!user){
    res.status(404).json({message:"no user found "});
    }

    res.clearCookie("auth_token");

    return res.status(200).json({ message: "user deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: "error in deleting user" });
  }
};
