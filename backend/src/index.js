import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is ready!");
});

app.use("/api/v1/users", userRouter);
app.get("/api/email", (req, res) => {
  res.json({ email: "shahidvelom@gmail.com" });
});

// Store connected users and shared code
let users = [];
let sharedCode = "// Start coding...";

// Socket.IO setup
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join", (userId) => {
    console.log(`User ${userId} joined with socket ID ${socket.id}`);
    users.push({ socketId: socket.id, userId });
    io.emit("userList", users.map(user => user.userId));
  });

  // Handle real-time code collaboration
  socket.on("codeUpdate", (newCode) => {
    sharedCode = newCode;
    socket.broadcast.emit("codeUpdate", newCode);
  });

  // Send existing code to the new user
  socket.emit("codeUpdate", sharedCode);

  // Handle chat messages
  socket.on("joinChat", (username) => {
    socket.username = username;
    io.emit("userJoined", `${username} has joined the chat!`);
  });

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", `${socket.username}: ${message}`);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    users = users.filter(user => user.socketId !== socket.id);
    io.emit("userList", users.map(user => user.userId));
    io.emit("userLeft", `${socket.username} has left the chat.`);
    console.log("User disconnected:", socket.id);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });
