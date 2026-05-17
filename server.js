import "dotenv/config"; 

import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dmRoutes from "./routes/dmRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import socketHandler from "./socket/socketHandler.js";

connectDB();

const app = express();
const allowedOrigin = process.env.CLIENT_URL?.trim();
app.use(cors({ origin: allowedOrigin, credentials: true }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dms", dmRoutes);
app.use("/api/search", searchRoutes);
app.get("/", (req, res) => res.json({ message: "Chat API is running " }));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: allowedOrigin, methods: ["GET", "POST"] },
});

socketHandler(io);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});