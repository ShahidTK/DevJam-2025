import React, { useState, useEffect, useCallback, useRef } from "react";
import { io } from "socket.io-client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useLocation } from "react-router-dom";

const Chat = () => {
  const location = useLocation();
  const username = location.state?.username || "Guest";
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joined, setJoined] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state for joining room
  const messagesEndRef = useRef(null); // For auto-scrolling to the latest message

  const socket = useRef(null); // Use useRef to persist socket instance

  // Initialize socket connection
  useEffect(() => {
    socket.current = io("http://localhost:8000");

    // Cleanup on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Socket event listeners
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

    const handleUserJoined = (msg) => {
      toast.success(msg, { position: "top-center" });
      setMessages((prev) => [
        ...prev,
        { text: msg, sender: "System", timestamp: new Date().toISOString() },
      ]);
    };

    const handleUserLeft = (msg) => {
      toast.error(msg, { position: "top-center" });
      setMessages((prev) => [
        ...prev,
        { text: msg, sender: "System", timestamp: new Date().toISOString() },
      ]);
    };

    const handleError = (error) => {
      toast.error(error, { position: "top-center" });
    };

    socket.current.on("receiveMessage", handleReceiveMessage);
    socket.current.on("userJoined", handleUserJoined);
    socket.current.on("userLeft", handleUserLeft);
    socket.current.on("error", handleError);

    // Cleanup listeners
    return () => {
      socket.current.off("receiveMessage", handleReceiveMessage);
      socket.current.off("userJoined", handleUserJoined);
      socket.current.off("userLeft", handleUserLeft);
      socket.current.off("error", handleError);
    };
  }, []);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const joinChat = useCallback(async () => {
    if (!username.trim() || !room.trim()) {
      toast.warn("Please enter a valid username and room name.", {
        position: "top-center",
      });
      return;
    }
  
    setIsLoading(true);
    try {
      socket.current.emit("joinRoom", { username, room });
      setJoined(true);
    } catch (error) {
      toast.error("Failed to join the room. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }, [username, room]);
  
  const sendMessage = useCallback(() => {
    if (!message.trim()) {
      toast.warn("Message cannot be empty.", { position: "top-center" });
      return;
    }

    const messageData = {
      sender: username,
      text: message,
      timestamp: new Date().toISOString(),
    };

    socket.current.emit("sendMessage", { username, message, room });
    setMessages((prev) => [...prev, messageData]);
    setMessage("");
  }, [message, username, room]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center mb-6">Chat to your mentor</h2>

        {!joined ? (
          <div className="flex flex-col space-y-4">
            <input
              type="text"
              placeholder="Enter your name"
              value={username}
              readOnly // Username is passed via location state
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
              disabled={isLoading}
              className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition text-lg disabled:opacity-50"
            >
              {isLoading ? "Joining..." : "Join Chat"}
            </button>
          </div>
        ) : (
          <div>
            <div className="h-80 border rounded-lg overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 ? (
                <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
              ) : (
                messages.map((msg, index) => {
                  if (!msg || !msg.sender || !msg.text) {
                    console.error("Invalid message:", msg); // Debugging log
                    return null; // Skip rendering invalid messages
                  }

                  return (
                    <div
                      key={index}
                      className={`p-3 my-2 rounded-lg max-w-[75%] ${
                        msg.sender === username
                          ? "bg-green-500 text-white ml-auto text-right"
                          : msg.sender === "System"
                          ? "bg-yellow-100 text-gray-800 mx-auto text-center"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <strong>{msg.sender}:</strong> {msg.text}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} /> {/* Auto-scroll anchor */}
            </div>

            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="p-3 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
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
};

export default React.memo(Chat);