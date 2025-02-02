import React, { useState } from "react";

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-xs md:max-w-md transition-all duration-300">
        {/* Title Section */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Login to Mentorship Platform
          </h1>
          <p className="text-gray-600 text-sm">
            {isLogin ? "Continue your learning journey" : "Start your learning journey"}
          </p>
        </div>

        {/* Form Container */}
         <div className={`space-y-${isLogin ? '4' : '3'}`}>

          <form className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              />
            )}

            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
            />

            {!isLogin && (
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              />
            )}

            {isLogin && (
              <div className="text-right">
                <a href="#" className="text-blue-600 text-sm hover:text-blue-500 transition-colors">
                  Forgot Password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-transform"
            >
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          {/* Social Login */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 transition-transform">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
            </button>
            <button className="w-full flex items-center justify-center p-2 border border-gray-300 rounded-lg hover:bg-gray-50 active:scale-95 transition-transform">
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub"
                className="w-5 h-5"
              />
            </button>
          </div>

          {/* Toggle Button */}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-center text-sm text-blue-600 bg-blue-50 py-2 rounded-lg hover:bg-blue-100 active:scale-95 transition-transform"
          >
            {isLogin ? "New here? Create Account" : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;