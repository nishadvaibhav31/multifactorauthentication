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
  const { user, setUser, isverified } = useContext(AuthContext);
  const Url ='http://localhost:4000'
  useEffect(() => {
    if (user)
      axios
        .get(`${Url}/api/verifytoken`, {
          withCredentials: true,
        })
        .catch((error) => {
          toast.error(error.response?.data?.message || "An error occurred");
          localStorage.removeItem("user");
          setUser(null);
        });
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={user? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={user && isverified ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={user && isverified ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="/change" element={user ? <Change /> : <Login />} />
        <Route path="/reset" element={<Reset />} />
      </Routes>

      <Toaster />
    </BrowserRouter>
  );
}

export default App;
