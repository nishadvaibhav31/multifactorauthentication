import otpGenerator from "otp-generator";
import User from "../models/users.model.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken"

export const otpgens = async (req, res) => {
  const { email } = req.body;
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

   
    const token = jwt.sign({ otp, email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2m",
    });

    // 4. Configure and send email OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    // 5. Respond with token
    return res.json({
      message: "OTP sent successfully",
      token,
    });
  } catch (error) {
    console.error("Error in OTP generation:", error);
    return res.status(500).json({ message: "Error in OTP sending" });
  }
};
export const otpgen = async (req, res) => {
  const { email } = req.body;
  try {
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Email not registered" });
    }

    
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

   
    const token = jwt.sign({ otp, email }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2m",
    });

    // 4. Configure and send email OTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "OTP Verification",
      text: `Your OTP is ${otp}`,
    });

    // 5. Respond with token
    return res.json({
      message: "OTP sent successfully",
      token,
    });
  } catch (error) {
    console.error("Error in OTP generation:", error);
    return res.status(500).json({ message: "Error in OTP sending" });
  }
};
export const verifyotp = async (req, res) => {
  const { token, enterotp,email } = req.body;
 
  
  const decode =jwt.verify(token,process.env.JWT_SECRET_KEY);
  const user=await User.findOne({email});
  let s="signup";
  if(user) s="login";

  
  if (decode.otp!=enterotp) {
    return res.status(401).json({ message: "wrong otp " });
  }
  return res.status(200).json({
    message: "otp verify successfull",
    user:{
      email,
    },
    check:s,

  });
};
