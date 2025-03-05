import React, { useState, useContext } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../hooks/Authcontext";
function Signup() {
  const [username, setusername] = useState("");
  const [fullname, setfullname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [enterotp,setenterotp] =useState("");
  const {user,signup,otpverify,otpgen,otp,setUser,setotp} = useContext(AuthContext);
  const [confirmpassword, setcfpassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!otp)  await signup(username, fullname, email, password, confirmpassword);
    if(!otp) await otpgen(username);
    if(otp){ await otpverify(username,enterotp);
    setenterotp("");
          setotp(null); 
           }
  };
  const deleteuser= async(username)=>{
  
    await axios.post(
        `${Url}/api/delete`,
        { username},
        { withCredentials: true }
      );

  }

  return (
    <div className="flex flex-col h-[100vh] justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Signup</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             disabled ={otp?true:false}
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Fullname"
            value={fullname}
            onChange={(e) => setfullname(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             disabled ={otp?true:false}
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             disabled ={otp?true:false}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             disabled ={otp?true:false}
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => setcfpassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
             disabled ={otp?true:false}
          />
        </div>
         <div className={`mb-4 ${!otp?'hidden':''}`}>
          <input
            type="text"
            placeholder="enter otp"
            value={enterotp}
            onChange={(e) => setenterotp(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            
          />
        </div>
        <div className="mb-6 flex flex-row ">
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
           {
            otp?(<h2>Verify Otp</h2>):(<h2>Signup</h2>)
           }
          </button>
           <button
             onClick={()=>{
          
            setUser(null)
            localStorage.removeItem("user")
            setotp(null)
           await  deleteuser(username)
          }
             }
            className={`${!otp?'hidden':''} w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
          back
          </button>
        </div>
      </form>
      <div className="mt-4">
        <Link to="/login" className="text-blue-500 hover:underline">
          Already have an account?
        </Link>
      </div>
    </div>
  );
}

export default Signup;
