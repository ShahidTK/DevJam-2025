import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to your backend

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

// Client-side code (React)
useEffect(() => {
  if (!socket.current) return;

  const handleReceiveMessage = (newMessage) => {
    console.log("Received message:", newMessage); // Debugging log
    if (!newMessage || !newMessage.sender || !newMessage.text) {
      console.error("Invalid message received:", newMessage); // Debugging log
      return;
    }
    setMessages((prev) => [...prev, newMessage]);
  };

  socket.current.on("receiveMessage", handleReceiveMessage);

  return () => {
    socket.current.off("receiveMessage", handleReceiveMessage);
  };
}, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessages((prev) => [...prev, `You: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Real-Time Chat</h2>
      <div
        style={{
          height: "300px",
          border: "1px solid #ccc",
          overflowY: "auto",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
       {messages.map((msg, index) => (
  <div
    key={index}
    className={`p-3 my-2 rounded-lg max-w-[75%] ${
      msg.sender === username
        ? "bg-green-500 text-white ml-auto text-right"
        : "bg-gray-200 text-gray-800"
    }`}
  >
    <strong>{msg.sender}:</strong> {msg.text}
    <br />
    <span className="text-xs text-gray-500">
      {new Date(msg.timestamp).toLocaleTimeString()}
    </span>
  </div>
))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ width: "70%", padding: "8px" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "10px" }}>
        Send
      </button>
    </div>
  );
}

export default Chat;
