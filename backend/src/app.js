import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import userRouter from "./routes/user.routes.js";
import { configureSocket } from "./socket/socket.js"; // Separate Socket.IO logic
import errorHandler from "./middleware/errorHandler.js"; // Centralized error handling

dotenv.config();

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL || "*" })); // Restrict CORS to specific origin
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Server is ready!");
});

app.use("/api/v1/users", userRouter);
app.get("/api/email", (req, res) => {
  res.json({ email: "shahidvelom@gmail.com" });
});

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*", // Restrict CORS to specific origin
    methods: ["GET", "POST"],
  },
});

configureSocket(io); // Configure Socket.IO logic

// Centralized error handling
app.use(errorHandler);

// Connect to MongoDB and start server
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