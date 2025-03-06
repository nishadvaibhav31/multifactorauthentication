import Email from "../models/email.model.js";
import otpGenerator from "otp-generator";
import User from "../models/users.model.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken"

export const otpgen = async (req, res) => {
  const {email}=req.body;
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  // const { username } = req.body;

  try {
    
   const token=jwt.sign({otp:otp},process.env.JWT_SECRET_KEY,{expiresIn:'2min'});
    

    

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

    return res.json({
      message: "OTP sent successfully",
      token,
    });
  } catch (error) {
    // console.error("Error in OTP generation or sending e:", error);
    return res.status(400).json({ message: "Error in OTP sending" });
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
