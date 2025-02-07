import React, { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const socket = io("http://localhost:8000");

// toast.configure(); // Initialize toast notifications

function Chat() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    socket.on("userJoined", (msg) => {
      toast.success(msg, { position: "top-center" }); // Show notification
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("userLeft", (msg) => {
      toast.error(msg, { position: "top-center" }); // Show notification
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("userJoined");
      socket.off("userLeft");
    };
  }, []);

  const joinChat = () => {
    if (username.trim() && room.trim()) {
      socket.emit("joinRoom", { username, room });
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", { username, message, room });
      setMessages((prev) => [
        ...prev,
        { text: message, sender: "You", isOwn: true },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">💬 Real-Time Chat</h2>

        {!joined ? (
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="text"
              placeholder="Enter room name"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={joinChat}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition text-lg"
            >
              Join Chat
            </button>
          </div>
        ) : (
          <div>
            <div className="h-80 border rounded-lg overflow-y-auto p-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 my-2 rounded-lg max-w-[75%] ${
                    msg.isOwn
                      ? "bg-green-500 text-white ml-auto text-right"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>

            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="p-3 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={sendMessage}
                className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition text-lg"
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
