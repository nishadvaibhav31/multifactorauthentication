import React, { useContext, useEffect } from "react";
import axios from "axios";
// import { logout } from '../../../backend/controllers/authcontroller';
import { Link } from "react-router-dom";
import { AuthContext } from "../../hooks/Authcontext";
import toast from "react-hot-toast";
function Home() {
  const { logout } = useContext(AuthContext);

  return (
<div className="flex flex-col justify-center items-center p-4 bg-gray-100 h-screen">
  <h1 className="text-3xl font-bold mb-4">Home</h1>
  <div className="space-y-4">
    <button
      onClick={logout}
      className="px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      Logout
    </button>
  </div>
</div>

  );
}

export default Home;
