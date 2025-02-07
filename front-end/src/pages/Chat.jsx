import React, { useState, useEffect } from "react";
import axios from "axios";

const fetchUserDetails = async () => {
    try {
        const response = await axios.get("api/v1/users/getuserid", {
            withCredentials: true,  // Send cookies if using session auth
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}` // If using JWT
            }
        });

        console.log("User Data:", response.data);
        return response.data.data;
    } catch (error) {
        console.error("Error fetching user:", error.response?.data || error.message);
    }
};

// fetch("api/v1/users/getuserid", {
//   headers: {
//       "Authorization": `Bearer ${localStorage.getItem("token")}` // If using JWT
//   }
// })
// .then(response => response.json())
// .then(data => {
//   console.log("User Name:", data.data.name);
// })
// .catch(error => console.error("Error fetching user:", error));

// fetchUserDetails();

import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

function Chat() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("userJoined", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("userLeft", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userJoined");
      socket.off("userLeft");
    };
  }, []);

  socket.on("connect", async () => {
    console.log("Connected with socket ID:", socket.id);
    
    // Fetch user details from the API
    const user = await fetchUserDetails();

    if (user) {
        // Send user details to the server
        socket.emit("join", user.id);
    }
});

  const joinChat = () => {
    if (username.trim()) {
      socket.emit("joinChat", username);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, `You: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">💬 Real-Time Chat</h2>

        {!joined ? (
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={joinChat}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
            >
              Join Chat
            </button>
          </div>
        ) : (
          <div>
            <div className="h-64 border rounded-lg overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <p key={index} className="text-sm py-1">{msg}</p>
              ))}
            </div>

            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="p-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
