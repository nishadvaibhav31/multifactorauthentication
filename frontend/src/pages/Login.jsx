import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../hooks/Authcontext';

function Login() {
  const [email, setemail] = useState('');
  const [password, setpassword] = useState('');
  const [enterotp, setenterotp] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { user, login, otpverify, otpgen, otp, setUser, setotp } = useContext(AuthContext);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  const handleGenerateOtp = async () => {
    if (user && user.email) {
      setIsLoading(true);
      await otpgen(user.email);
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await otpverify(otp, enterotp, email,user.token);
    setIsLoading(false);
    setenterotp('');
  };

  if (!user) {
    return (
      <div className="flex flex-col h-screen justify-center items-center bg-gray-100 p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h1>
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <Link to="/signup" className="text-sm text-blue-500 hover:underline block">
              Don't have an account? Sign Up
            </Link>
            <Link to="/reset" className="text-sm text-blue-500 hover:underline block">
              Reset Password
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (user && !otp) {
    return (
      <div className="flex flex-col h-screen justify-center items-center bg-gray-100 p-4">
        <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-800">Verification Required</h2>
          <p className="text-gray-600 mt-2 mb-6">Click the button below to send a security code to your email.</p>
          <button
            onClick={handleGenerateOtp}
            disabled={isLoading}
            className="w-full p-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-green-300 transition-colors"
          >
            {isLoading ? 'Sending...' : 'Generate OTP'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Enter Security Code</h1>
        <p className="text-center text-gray-500 mb-6">A code was sent to {email}</p>
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
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setUser(null);
              // localStorage.removeItem("otp");
              setotp(null);
            }}
            className="text-sm text-gray-500 hover:underline"
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
