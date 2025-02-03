import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SunIcon, MoonIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { CodeBracketIcon, ChatBubbleLeftIcon, RectangleGroupIcon, VideoCameraIcon } from "@heroicons/react/24/solid";

const HomePage2 = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userName, setUserName] = useState(""); // Holds username

  useEffect(() => {
    // Fetch username when component mounts
    const fetchUserName = async () => {
      try {
        const response = await axios.get("/api/v1/users/getuserid");
        setUserName(response.data.email); // Set username
        console.log(response.data);
      } catch (error) {
        console.log("Error fetching username:", error);
      }
    };

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setIsLogin(true);
      fetchUserName(); // Fetch username if user is logged in
    }
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/v1/users/logout"); // No need to send formData
      localStorage.removeItem("user"); // Clear user data from localStorage
      setIsLogin(false);
      setUserName(""); // Clear username
      navigate("/login");
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Navbar */}
      <nav className="bg-[#232F3E] fixed w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">CollabMentor</span>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-6">
              <button onClick={() => setDarkMode(!darkMode)} className="text-gray-300 hover:text-white">
                {darkMode ? <SunIcon className="h-6 w-6" /> : <MoonIcon className="h-6 w-6" />}
              </button>

              <button className="text-gray-300 hover:text-white">
                <Cog6ToothIcon className="h-6 w-6" />
              </button>

              {/* Profile Section */}
              {isLogin ? (
                <>
                  <button onClick={handleLogout} className="text-white px-4 py-2 rounded bg-red-600 hover:bg-red-700">
                    Log Out
                  </button>
                  <div className="flex items-center space-x-3 text-white">
                    <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                      {userName ? userName[0].toUpperCase() : "?"}
                    </div>
                    <span>{userName || "Guest"}</span>
                  </div>
                </>
              ) : (
                <button onClick={() => navigate("/")} className="text-white px-4 py-2 rounded bg-green-600 hover:bg-green-700">
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold ${darkMode ? "text-gray-100" : "text-gray-900"} mb-4`}>
              Collaborative Workspace
            </h1>
            <p className={`text-lg ${darkMode ? "text-white-100" : "text-gray-900"}`}>
              Start or join a real-time collaboration session
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CodeBracketIcon, title: "Code Editor", color: "bg-blue-100 dark:bg-blue-900" },
              { icon: ChatBubbleLeftIcon, title: "Team Chat", color: "bg-green-100 dark:bg-green-900" },
              { icon: RectangleGroupIcon, title: "Whiteboard", color: "bg-purple-100 dark:bg-purple-900" },
              { icon: VideoCameraIcon, title: "Video Call", color: "bg-red-100 dark:bg-red-900" },
            ].map((feature, index) => (
              <div
                key={index}
                className={`${feature.color} p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer`}
              >
                <feature.icon className="h-12 w-12 text-gray-800 dark:text-white mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-center mt-2 text-gray-600 dark:text-gray-300">Start new session</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#232F3E] mt-12 py-6 fixed bottom-0 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-300">© {new Date().getFullYear()} CollabMentor. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage2;
