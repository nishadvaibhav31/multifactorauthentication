import React, { useContext, useEffect } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { AuthContext } from "../hooks/Authcontext.jsx";
import Change from "./pages/Change";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Reset from "./pages/Reset";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import toast from "react-hot-toast";

function App() {
  const { user, setUser,isverified} = useContext(AuthContext);
  const Url ='https://multifactorauthentication.onrender.com'

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={(user&&isverified)?<Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={(user&&isverified)?<Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={(user&&isverified)?<Navigate to="/" /> : <Signup />}
        />
        
        <Route path="/reset" element={<Reset />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
