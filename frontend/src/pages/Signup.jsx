import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { AuthContext } from '../../hooks/Authcontext';

function Signup() {
  const [username, setusername] = useState('');
  const [fullname, setfullname] = useState('');
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [confirmpassword, setcfpassword] = useState('');
  const [enterotp, setenterotp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [signupStep, setSignupStep] = useState('details');

  const { otp, otpgens, otpverify, signup, setUser, setotp } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmpassword) {
      return toast.error("Passwords do not match!");
    }
    setIsLoading(true);
    await otpgens(email); 
    setIsLoading(false);
    setSignupStep('otp');
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const isOtpValid = await otpverify(otp, enterotp, email);

    if (isOtpValid) {
      await signup(username, fullname, email, password, confirmpassword);
      navigate('/login');
      setotp(null);
    }
    
    setIsLoading(false);
  };

  const handleclick = () => {
    setusername('');
    setfullname('');
    setemail('');
    setpassword('');
    setcfpassword('');
    setenterotp('');
    setSignupStep('details');
    setUser(null);
    setotp(null);
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-xl">
        {signupStep === 'details' && (
          <>
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h1>
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setusername(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Full Name"
                value={fullname}
                onChange={(e) => setfullname(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setemail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmpassword}
                onChange={(e) => setcfpassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                {isLoading ? 'Sending Code...' : 'Continue'}
              </button>
            </form>
          </>
        )}

        {signupStep === 'otp' && (
          <>
            <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Verify Your Email</h1>
            <p className="text-center text-gray-500 mb-6">Enter the code sent to {email}</p>
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={enterotp}
                onChange={(e) => setenterotp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
              >
                {isLoading ? 'Verifying...' : 'Create Account'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button onClick={handleclick} className="text-sm text-gray-500 hover:underline">
                Back
              </button>
            </div>
          </>
        )}

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-blue-500 hover:underline">
            Already have an account? Log In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
