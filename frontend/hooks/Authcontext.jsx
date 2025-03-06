import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))||null
  );
  const [otp, setotp] = useState(null);
  const [isverified, setisverified] = useState(false);
  const Url ='https://multifactorauthentication.onrender.com'

  const otpverify = async (token, enterotp,email) => {
    try {
      const res = await axios.post(
        `${Url}/api/verifyotp`,
        { token, enterotp,email },
        { withCredentials: true }
      );
      // console.log(res);
      localStorage.setItem("isverified",JSON.stringify(true));
      localStorage.setItem("user",JSON.stringify(user));
      localStorage.removeItem("otp");
      setotp(null);
      setisverified(true);
     
      
      toast.success(`${res?.data?.check} successfully`)
      
    } catch (error) {
     
     if(!isverified)toast.error(error.response?.data?.message);
      setotp(null);
      setUser(null);
    }
  };
  // console.log("app is rendered");
  const otpgen = async (email) => {
   
    try {
      const res = await axios.post(
        `${Url}/api/otpgeneration`,
        {email},
        { withCredentials: true }
      );
     setotp(res.data.token);
    toast.success("otp sent successfully ");
     localStorage.setItem("otp",JSON.stringify(res.data.token));
    } catch (error) {
      if(user) toast.error(error.data?.response?.message);
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
      toast.success("generate otp for login");
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
    confirmpassword,
    isverified

  ) => {
    try {
      const response = await axios.post(
        `${Url}/api/signup`,
        { username, fullname, email, password, confirmpassword,isverified},
        { withCredentials: true }
      );
      setUser(response.data.user);
    } catch (error) {
      
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
