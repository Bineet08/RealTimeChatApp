import express from 'express';
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import { userRoutes } from './routes/userRoutes.js';

const app = express();
const server = http.createServer(app)

app.use(express.json({limit:"10mb"}));
app.use(cors());

app.use("/api/status", (req,res)=> res.send("server is running"));
app.use('/api/auth',userRoutes);

await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Server is running on port: " + PORT ))