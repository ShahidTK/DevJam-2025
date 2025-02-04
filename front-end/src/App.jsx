// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/HomePage2" element={<HomePage2 />} />
        <Route path="/Whiteboard" element={<WhiteBoard />} />
        <Route path="/VideoCall" element={<VideoCall />} />
        <Route path="/CodeEditor" element={<CodeEditor />} />
        <Route path="/Chat" element={<Chat />} />
        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
