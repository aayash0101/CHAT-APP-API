import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import socketHandler from "./socket/socketHandler.js";

dotenv.config(); 
connectDB();     

const app = express();


app.use(cors({ origin: process.env.CLIENT_URL })); 
app.use(express.json()); 


app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

app.get("/", (req, res) => res.json({ message: "Chat API is running " }));


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
  },
});

socketHandler(io); 

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});