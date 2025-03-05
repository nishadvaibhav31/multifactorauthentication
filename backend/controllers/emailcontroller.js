import Email from "../models/email.model.js";
import otpGenerator from "otp-generator";
import User from "../models/users.model.js";
import nodemailer from "nodemailer";

export const otpgen = async (req, res) => {
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  const { username } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const email = user?.email;
    const verifyemail = new Email({
      email,
      otp,
    });

    await verifyemail.save();

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
      verifyemail: {
        email,
      },
    });
  } catch (error) {
    console.error("Error in OTP generation or sending email:", error);
    return res.status(400).json({ message: "Error in OTP sending" });
  }
};
export const verifyotp = async (req, res) => {
  const { enterotp, username } = req.body;
  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "no user found" });
  const email = user?.email;

  const check = await Email.findOneAndDelete({ email:email,otp:enterotp });

  if (!check) {
    return res.status(401).json({ message: "wrong otp " });
  }
  return res.status(200).json({
    message: "login successfull",
    user,
  });
};
