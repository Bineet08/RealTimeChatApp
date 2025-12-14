import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import { userRoutes } from "./routes/userRoutes.js";
import { messageRoutes } from "./routes/messageRoutes.js";
import { app, server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});