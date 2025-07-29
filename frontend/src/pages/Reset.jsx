
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const API_BASE_URL = 'https://multifactorauthentication.onrender.com';

function Reset() {
  const [email, setemail] = useState("");
  const [enterotp, setenterotp] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [step, setStep] = useState(1);
  const [otpVerificationToken, setOtpVerificationToken] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const changepass = async (email, newpassword) => {
    if (newpassword.length < 6) {
        toast.error("Password must be at least 6 characters long.");
        return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/reset`,
        { email, newpassword },
        { withCredentials: true }
      );
      toast.success("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        setemail("");
        setenterotp("");
        setnewpassword("");
        setOtpVerificationToken(null);
        setStep(1);
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  const otpverify = async (token, enteredOtp, email) => {
    if (!enteredOtp) {
        toast.error("Please enter the OTP.");
        return;
    }
    setIsLoading(true);
    try {
      await axios.post(
        `${API_BASE_URL}/api/verifyotp`,
        { token, enterotp: enteredOtp, email },
        { withCredentials: true }
      );
      toast.success("OTP verified successfully!");
      setStep(3);
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error(error.response?.data?.message || "Too many attempts. Please try again later.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to verify OTP. Please check the code and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const otpgen = async (email) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        toast.error("Please enter a valid email address.");
        return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/api/otpgeneration`,
        { email },
        { withCredentials: true }
      );
      setOtpVerificationToken(res.data.token);
      setStep(2);
      toast.success("An OTP has been sent to your email.");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error(error.response?.data?.message || "Too many OTP requests. Please try again later.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to generate OTP. Please check your email and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    otpgen(email);
  };

  const handleStep2Submit = (e) => {
    e.preventDefault();
    otpverify(otpVerificationToken, enterotp, email);
  };

  const handleStep3Submit = (e) => {
    e.preventDefault();
    changepass(email, newpassword);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>

        {step === 1 && (
          <form onSubmit={handleStep1Submit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <p className="text-center text-sm text-gray-600">Enter the OTP sent to <span className="font-medium">{email}</span>.</p>
            <input
              type="text"
              value={enterotp}
              onChange={(e) => setenterotp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3Submit} className="space-y-4">
            <p className="text-center text-sm text-gray-600">OTP verified. Please enter your new password.</p>
            <input
              type="password"
              value={newpassword}
              onChange={(e) => setnewpassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
      <div className="mt-6">
        <Link to="/login" className="text-blue-600 hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default Reset;

