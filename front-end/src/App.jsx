// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // ✅ Import ToastContainer
import "react-toastify/dist/ReactToastify.css"; // ✅ Import styles

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import HomePage2 from "./pages/HomePage2";
import WhiteBoard from "./pages/WhiteBoard";
import VideoCall from "./pages/VideoCall";
import CodeEditor from "./pages/CodeEditor";
import Chat from "./pages/Chat";

const App = () => {
  return (
    <Router>
      <div>
        <ToastContainer position="top-right" autoClose={3000} /> 
        {/* ✅ No need for toast.configure() */}

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/HomePage2" element={<HomePage2 />} />
          <Route path="/Whiteboard" element={<WhiteBoard />} />
          <Route path="/VideoCall" element={<VideoCall />} />
          <Route path="/CodeEditor" element={<CodeEditor />} />
          <Route path="/Chat" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
