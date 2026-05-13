import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";

const socketHandler = (io) => {
  // 🔒 Middleware: authenticate every socket connection via JWT
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = user; // attach user to socket for later use
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`🔌 ${socket.user.username} connected`);

    // Mark user as online in DB
    await User.findByIdAndUpdate(socket.user._id, { isOnline: true });

    // Broadcast to everyone that this user is now online
    io.emit("user:online", { userId: socket.user._id, username: socket.user.username });

    // --- JOIN ROOM ---
    socket.on("room:join", async (roomId) => {
      socket.join(roomId);           // Socket.io "room" = our chat room
      console.log(`${socket.user.username} joined room ${roomId}`);

      // Notify others in the room
      socket.to(roomId).emit("room:userJoined", {
        username: socket.user.username,
      });
    });

    // --- LEAVE ROOM ---
    socket.on("room:leave", (roomId) => {
      socket.leave(roomId);
      socket.to(roomId).emit("room:userLeft", {
        username: socket.user.username,
      });
    });

    // --- SEND MESSAGE ---
    socket.on("message:send", async ({ roomId, content }) => {
      if (!content?.trim()) return; // ignore empty messages

      // Save to MongoDB
      const message = await Message.create({
        room: roomId,
        sender: socket.user._id,
        content: content.trim(),
      });

      // Populate sender username before broadcasting
      const populated = await message.populate("sender", "username");

      // Send to EVERYONE in the room (including sender)
      io.to(roomId).emit("message:receive", {
        _id: populated._id,
        content: populated.content,
        sender: populated.sender,
        createdAt: populated.createdAt,
        roomId,
      });
    });

    // --- TYPING INDICATORS ---
    socket.on("typing:start", ({ roomId }) => {
      // Tell everyone ELSE in the room this user is typing
      socket.to(roomId).emit("typing:update", {
        username: socket.user.username,
        isTyping: true,
      });
    });

    socket.on("typing:stop", ({ roomId }) => {
      socket.to(roomId).emit("typing:update", {
        username: socket.user.username,
        isTyping: false,
      });
    });

    // --- DISCONNECT ---
    socket.on("disconnect", async () => {
      console.log(`🔌 ${socket.user.username} disconnected`);
      await User.findByIdAndUpdate(socket.user._id, { isOnline: false });

      // Broadcast offline status
      io.emit("user:offline", { userId: socket.user._id, username: socket.user.username });
    });
  });
};

export default socketHandler;