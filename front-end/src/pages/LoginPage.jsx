// src/components/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate("/"); // Redirect to the Login Page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Login Page</h1>
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
      >
        back to home page
      </button>
    </div>
  );
};

export default LoginPage;