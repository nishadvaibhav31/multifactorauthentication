import React, { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [otp, setotp] = useState(null);
  const [isverified, setisverified] = useState(false);
  console.log(user);
  const Url = 'https://multifactorauthentication.onrender.com';

  const otpverify = async (token, enterotp, email,purposetoken) => {
    
    if (!token) {
      toast.error("OTP Token not found. Please generate a new one.");
      return false;
    }
    try {
      const res = await axios.post(
        `${Url}/api/verifyotp`,
        { token, enterotp, email,purposetoken},
        { withCredentials: true }
      );
      setotp(null);
      setisverified(true);
      toast.success(`Otp verified successfully`);
      return true;
    } catch (error) {
       if (error.response?.status === 429) {
        toast.error(error.response?.data?.message || "Too many Verification attempt. Please try again after 5 minutes.");
      } else {
        toast.error(error.response?.data?.message || "Wrong OTP");
      }
      setotp(null);
      setUser(null);
      return false;
    }
  };

  const otpgen = async (email) => {
    try {
      const res = await axios.post(
        `${Url}/api/otpgeneration`,
        { email},
        { withCredentials: true }
      );
      setotp(res.data.token);
      toast.success("OTP sent successfully");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error(error.response?.data?.message || "Too many OTP attempts. Please try again after 2 minutes.");
      } else {
        toast.error(error.response?.data?.message || "Failed to generate OTP");
      }
      setUser(null);
    }
  };

  const otpgens = async (email) => {
    try {
      const res = await axios.post(
        `${Url}/api/otpgenerations`,
        { email },
        { withCredentials: true }
      );
      setotp(res.data.token);
      toast.success("OTP sent successfully");
    } catch (error) {
      if (error.response?.status === 429) {
        toast.error(error.response?.data?.message || "Too many OTP attempts. Please try again after 2 minutes.");
      } else {
        toast.error(error.response?.data?.message || "Failed to generate OTP");
      }
      setUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${Url}/api/login`,
        { email, password },
        { withCredentials: true }
      );
      setUser(res.data.user);
      toast.success("Login successful. Please generate an OTP.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error in login");
      setUser(null);
    }
  };

  const signup = async (username, fullname, email, password, confirmpassword) => {
    try {
      await axios.post(
        `${Url}/api/signup`,
        { username, fullname, email, password, confirmpassword },
        { withCredentials: true }
      );
      setisverified(false);
      setUser(null);
      toast.success("Signup successful!");
     
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error in signup');
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${Url}/api/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout failed, .", error);
    } finally {
      setisverified(false);
      setotp(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        signup,
        otp,
        setotp,
        otpverify,
        otpgen,
        otpgens,
        isverified,
        setisverified,
        
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
