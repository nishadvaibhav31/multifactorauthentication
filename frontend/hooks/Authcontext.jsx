import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [otp, setotp] = useState(null);
  const [isverified, setisverified] = useState(false);
  const Url ='https://multifactorauthentication.onrender.com'

  const otpverify = async (username, enterotp) => {
    try {
      const res = await axios.post(
        `${Url}/api/verifyotp`,
        { username, enterotp },
        { withCredentials: true }
      );
      // console.log(res);
      setisverified(true);
      toast.success("otp verified succesfully ");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);

      setotp(null);
      localStorage.removeItem("user");
      setUser(null);
    }
  };
  // console.log("app is rendered");
  const otpgen = async (username) => {
   
    try {
      const res = await axios.post(
        `${Url}/api/otpgeneration`,
        { username },
        { withCredentials: true }
      );
    
     setotp(res.data.verifyemail);
toast.success("otp sent successfully ");
    
    } catch (error) {
      
      if(user) toast.error(error.data?.response?.message);
      
      setUser(null);
    }
    
  };
  const login = async (username, password) => {
    try {
      const res = await axios.post(
        `${Url}/api/login`,
        { username, password },
        { withCredentials: true }
      );

      setUser(res.data.user);
      toast.success("please wait for the otp");
    } catch (error) {
      // console.log(error);
      toast.error(error.response.data.message);
      setUser(null);
    }
  };

  const signup = async (
    username,
    fullname,
    email,
    password,
    confirmpassword
  ) => {
    try {
      const response = await axios.post(
        `${Url}/api/signup`,
        { username, fullname, email, password, confirmpassword },
        { withCredentials: true }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setUser(response.data.user);
      toast.success("User Created");
    } catch (error) {
      // console.log(error);
      toast.error(error.response?.data?.message||'Error in signup');
      setUser(null);
    }
  };
  const logout = async () => {
    await axios.post(
      `${Url}/api/logout`,
      {},
      { withCredentials: true }
    );
    localStorage.removeItem("user");
    setisverified(false);
    setotp(null);
    setUser(null);
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
        isverified,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
