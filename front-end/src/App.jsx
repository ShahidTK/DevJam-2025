// src/App.js
import React,{useEffect, useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import HomePage2 from "./pages/HomePage2";


import axios from 'axios';


const App = () => {
 

  
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/HomePage2" element={<HomePage2 />} />

        {/* <Route path="/profile" element={<ProfilePage />} /> */}
      </Routes>
    </Router>
  );
};

export default App;