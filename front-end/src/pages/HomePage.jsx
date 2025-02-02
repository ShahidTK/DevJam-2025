// src/components/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login"); // Redirect to the Login Page
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Home Page</h1>
      <button
        onClick={handleLoginClick}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-all"
      >
        Login
      </button>
    </div>
  );
};

export default HomePage;