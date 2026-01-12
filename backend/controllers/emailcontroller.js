import otpGenerator from "otp-generator";
import User from "../models/users.model.js";
import jwt from "jsonwebtoken";
import SibApiV3Sdk from 'sib-api-v3-sdk';

// Configure Brevo API Key
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

// Utility function to send OTP email using Brevo
const sendEmailOTP = async (email, otp) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const sender = { email: process.env.EMAIL, name: "YourApp" };
  const receivers = [{ email }];

  const emailData = {
    sender,
    to: receivers,
    subject: "OTP Verification",
    textContent: `Your OTP is ${otp}. It expires in 1 minute.`,
  };

  await apiInstance.sendTransacEmail(emailData);
};

// Utility to generate and send OTP token + email
const generateAndSendOTP = async ({ email, purpose }, checkIfUserExists = null) => {
  if (checkIfUserExists !== null) {
    const user = await User.findOne({ email });
    if (checkIfUserExists && !user) {
      throw new Error("Email not registered");
    }
    if (!checkIfUserExists && user) {
      throw new Error("Email already registered");
    }
  }

  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });

  const token = jwt.sign({ otp, email, purpose }, process.env.JWT_SECRET_KEY, {
    expiresIn: "1m",
  });

  await sendEmailOTP(email, otp);

  return token;
};

// 1. Signup OTP (email should NOT exist)
export const otpgens = async (req, res) => {
  try {
    const token = await generateAndSendOTP({
      email: req.body.email,
      purpose: "signup"
    }, false);
    res.json({ message: "OTP sent successfully", token });
  } catch (err) {
    console.error("Signup OTP Error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// 2. Login OTP (email should exist)
export const otpgen = async (req, res) => {
  try {
    const token = await generateAndSendOTP({
      email: req.body.email,
      purpose: "login"
    }, true);
    res.json({ message: "OTP sent successfully", token });
  } catch (err) {
    console.error("Login OTP Error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// 3. Reset Password OTP (email should exist)
export const otpgenr = async (req, res) => {
  try {
    const token = await generateAndSendOTP({
      email: req.body.email,
      purpose: "reset"
    }, true);
    res.json({ message: "OTP sent successfully", token });
  } catch (err) {
    console.error("Reset OTP Error:", err.message);
    res.status(400).json({ message: err.message });
  }
};

// 4. Verify OTP
export const verifyotp = async (req, res) => {
  const { token, enterotp, email, purposetoken } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (decoded.otp !== enterotp || decoded.email !== email) {
      return res.status(401).json({ message: "Invalid OTP or email" });
    }

    if (purposetoken) {
      const decodedPurpose = jwt.verify(purposetoken, process.env.JWT_SECRET_KEY);
      const user = await User.findOne({ email });

      if (user && decoded.purpose === "login" && decodedPurpose.purpose === "login") {
        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
          expiresIn: "1h"
        });

        res.cookie("auth_token", authToken, {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 1000, // 1 hour
          sameSite: "None",
        });
      }
    }
    // If this is SIGNUP or RESET (Need proof of verification)
    if (decoded.purpose === "signup" || decoded.purpose === "reset") {
        // Generate a temporary token that proves this email was just verified
        const verificationToken = jwt.sign(
            { email: email, purpose: `verified_${decoded.purpose}` }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: "5m" } // Valid for 5 minutes only
        );

        return res.status(200).json({
            message: "OTP verified successfully",
            verificationToken: verificationToken, // Client needs this for the next step
            email: email
        });
    }

    res.status(200).json({
      message: "OTP verified successfully",
      user: { email },
    });

  } catch (error) {
    console.error("OTP Verification Error:", error);
    res.status(401).json({ message: "OTP verification failed or expired" });
  }
};
