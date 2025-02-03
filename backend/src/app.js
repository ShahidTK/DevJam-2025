import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true ,limit: '5mb'}));
app.use(express.static('public'));
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("✅ API is running...");
  })


import userRoutes from './routes/user.routes.js';
app.use("/api/v1/users/login", userRoutes);

export default app;