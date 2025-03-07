import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
function Reset() {
  const [email, setemail] = useState("");
  const [enterotp, setenterotp] = useState("");
  const [newpassword, setnewpassword] = useState("");
  const [otp, setotp] = useState(null);
  const [isverified, setisverified] = useState(false);
  const Url ='https://multifactorauthentication.onrender.com'
  const token=JSON.parse(localStorage.getItem("token"));
  const changepass = async (email, newpassword) => {
    try {
      await axios.post(
        `${Url}/api/reset`,
        { email, newpassword },
        { withCredentials: true }
      );

      toast.success("password reset  successfully");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  const otpverify = async (token, enterotp,email) => {
    try {
      await axios.post(
        `${Url}/api/verifyotp`,
        { token, enterotp,email },
        { withCredentials: true }
      );
      // console.log(res);
      setisverified(true);
      toast.success("otp verified ");
    } catch (error) {
      console.log(error);

      toast.error(error.response?.data?.message);
    }
  };
  const otpgen = async (email) => {
    try {
      const res = await axios.post(
        `${Url}/api/otpgeneration`,
        { email},
        { withCredentials: true }
      );
      localStorage.setItem("token",JSON.stringify(res.data.token));
      
      setotp(res.data);
      

      toast.success("otp sent successfully ");
    } catch (error) {
      //   console.log(error);
      toast.error(error.data?.response?.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) await otpgen(email);
    if (!isverified && otp) await otpverify(token,enterotp,email);
    if (isverified) {
    await changepass(email, newpassword);
    setenterotp("");
    setnewpassword("");
    setotp(null);
    setisverified(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div>
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
            Reset
          </h2>

          <input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="enter email"
            className={`w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={otp ? true : false}
          />
          <input
            type="text"
            value={enterotp}
            onChange={(e) => setenterotp(e.target.value)}
            placeholder="enter otp"
            className={`${!otp?'hidden':''} w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            disabled={isverified ? true : false}
          />
          <input
            type="text"
            value={newpassword}
            onChange={(e) => setnewpassword(e.target.value)}
            placeholder="enter new password"
            className={`${!isverified?'hidden':''} w-full p-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="mt-4">
        <Link to="/login " className="text-blue-500 hover:underline">
          back to login
        </Link>
      </div>
    </div>
  );
}

export default Reset;
