import React, { useContext, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../hooks/Authcontext";

function Login() {
  const [email,setemail] = useState("");
  const [password, setpassword] = useState("");
  const [enterotp,setenterotp] =useState("");
  const {user,login,otpverify,otpgen,otp,setUser,setotp,isverified} = useContext(AuthContext);
  const token=JSON.parse(localStorage.getItem("otp"));
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user)  await login(email,password);
    if(!otp&&user) await otpgen(email);
   if(otp) {await otpverify(token,enterotp,email);
    setenterotp("");  
  }
  };
  return (
    <div className="flex flex-col  h-[100vh] justify-center items-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-8 rounded-lg shadow-md"
      >
        <div className="mb-4 ">
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled ={user?true:false}
          />
        </div>
       
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled ={user?true:false}
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
        

        <div className="mb-6">
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
           {
            user?(otp?<h2>Verify Otp</h2>:<h2>generate Otp</h2>):(<h2>Login</h2>)
           }
          </button>
        </div>
      </form>
      <div className="mt-4">
        <Link to="/signup" onClick={()=>{
          setUser(null)
          localStorage.removeItem("otp");
          setotp(null);
        }          
        }   className="text-blue-500 hover:underline">
       
          Don't have an account?
         
        </Link>

      </div>
      <div className="mt-4">
        <Link to="/reset"  onClick={
          ()=>{
            setUser(null);
            setotp(null);
            localStorage.removeItem("otp");
          }          
        } className="text-blue-500 hover:underline">
       
         reset password
         
        </Link>
        
      </div>
    </div>
  );
}

export default Login;
