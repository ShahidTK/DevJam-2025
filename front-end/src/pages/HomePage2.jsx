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
   

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setIsLogin(true);
      fetchUserName(); // Fetch username if user is logged in
    }
  }, []);
  const fetchUserName = async () => {
    try {
      const token = localStorage.getItem("token"); // Get token from local storage
      const response = await axios.get("/api/v1/users/getuserid", {
        headers: {
          "Authorization": `Bearer ${token}` // Send token in request
        },
        withCredentials: true // If using cookies
      });

      setUserName(response.data.data.name); // ✅ Use 'data.name' if 'name' is returned

      // Set username
      console.log("User Data:", response.data);
    } catch (error) {
      console.log("❌ Error fetching username:", error.response?.data || error.message);
    }
  };
  
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

          {/* Show Username if Logged In */}
          {isLogin && userName ? (
          <span className="text-white font-semibold">Welcome, {userName} 👋</span>
          ) : (
          <span className="text-white">Loading...</span> // Show loading while fetching
          )}

          <button onClick={handleLogout} className="text-white px-4 py-2 rounded bg-green-600 hover:bg-green-700">
          Log Out
          </button>
          </div>

          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-5 mb-12 text-center">
  <h1 className={`text-5xl font-extrabold leading-tight ${darkMode ? "text-gray-100" : "text-gray-900"} mb-4`}>
    Learn, Code, <br /> & Collaborate in Real-Time!
  </h1>
  <p className={`text-lg ${darkMode ? "text-gray-300" : "text-gray-700"} max-w-3xl mx-auto`}>
    <span className="font-bold text-xl block mb-3">
      Empowering Mentorship & Team Collaboration
    </span>
    Experience interactive learning with <span className="font-bold">live video teaching</span>, 
a <span className="font-bold">real-time collaborative code editor</span>,  
and a <span className="font-bold">shared whiteboard</span>. Perfect for mentors, teams, and coding workshops, our platform  
    makes collaboration effortless.
  </p>
</div>


          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: CodeBracketIcon, title: "Code Editor", color: "bg-blue-100 dark:bg-blue-900", navlink: "codeEditor" },
              { icon: ChatBubbleLeftIcon, title: "Team Chat", color: "bg-green-100 dark:bg-green-900",navlink: "chat" },
              { icon: RectangleGroupIcon, title: "Whiteboard", color: "bg-purple-100 dark:bg-purple-900",navlink: "whiteBoard" },
              { icon: VideoCameraIcon, title: "Video Call", color: "bg-red-100 dark:bg-red-900",navlink: "videoCall" },
            ].map((feature, index) => (
              <div
              onClick={() => navigate(`/${feature.navlink}`)}

                key={index}

                className={`${feature.color} p-6 rounded-xl shadow-lg transform transition-all hover:scale-105 hover:shadow-xl cursor-pointer`}
              >
                <div className="grid place-items-center">
  <feature.icon className="h-12 w-12 text-gray-800 dark:text-white mb-4" />
</div>

                <h3 className="text-center text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
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
