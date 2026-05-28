import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Message from "../models/Message.js";

const socketHandler = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", async (socket) => {
    console.log(`🔌 ${socket.user.username} connected`);
    socket.join(socket.user._id.toString());

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
    socket.on("message:send", async ({ roomId, content, fileUrl, fileType, fileName, fileSize }) => {
      // Must have either content or a file
      if (!content?.trim() && !fileUrl) return;

      const message = await Message.create({
        room: roomId,
        sender: socket.user._id,
        content: content?.trim() || "",
        fileUrl: fileUrl || "",
        fileType: fileType || "",
        fileName: fileName || "",
        fileSize: fileSize || 0,
      });

      const populated = await message.populate("sender", "username avatar displayName");

      io.to(roomId).emit("message:receive", {
        _id: populated._id,
        content: populated.content,
        fileUrl: populated.fileUrl,
        fileType: populated.fileType,
        fileName: populated.fileName,
        fileSize: populated.fileSize,
        sender: populated.sender,
        createdAt: populated.createdAt,
        roomId,
      });
    });

    // When a user opens a room, mark messages as read and notify others
    socket.on("messages:read", async ({ roomId }) => {
      try {
        await Message.updateMany(
          {
            room: roomId,
            sender: { $ne: socket.user._id },
            readBy: { $ne: socket.user._id },
          },
          { $addToSet: { readBy: socket.user._id } }
        );

        // Tell everyone in the room that this user has read the messages
        socket.to(roomId).emit("messages:read", {
          roomId,
          userId: socket.user._id,
          username: socket.user.username,
        });
      } catch (err) {
        console.error("Mark as read error:", err);
      }
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

    // ── CALL SIGNALING ──────────────────────────────────────

    // User initiates a call
    socket.on("call:initiate", ({ targetUserId, roomId, callerName, callerAvatar, isGroup }) => {
      // For DMs — notify the specific user
      // For rooms — notify everyone in the room except caller
      if (isGroup) {
        socket.to(roomId).emit("call:incoming", {
          callerId: socket.user._id,
          callerName: callerName || socket.user.username,
          callerAvatar: callerAvatar || socket.user.avatar,
          roomId,
          isGroup: true,
        });
      } else {
        // Find the target user's socket and notify them
        io.to(targetUserId).emit("call:incoming", {
          callerId: socket.user._id,
          callerName: callerName || socket.user.username,
          callerAvatar: callerAvatar || socket.user.avatar,
          roomId,
          isGroup: false,
        });
      }
    });

    // Callee accepts the call
    socket.on("call:accepted", ({ callerId, roomId }) => {
      io.to(callerId).emit("call:accepted", {
        acceptedBy: socket.user._id,
        roomId,
      });
    });

    // Callee rejects the call
    socket.on("call:rejected", ({ callerId }) => {
      io.to(callerId).emit("call:rejected", {
        rejectedBy: socket.user._id,
        username: socket.user.username,
      });
    });

    // Either party ends the call
    socket.on("call:ended", ({ targetId, roomId }) => {
      if (targetId) {
        io.to(targetId).emit("call:ended");
      } else if (roomId) {
        socket.to(roomId).emit("call:ended");
      }
    });

    // WebRTC signaling — forward signal data to the target peer
    socket.on("call:signal", ({ targetId, signal }) => {
      io.to(targetId).emit("call:signal-received", {
        signal,
        senderId: socket.user._id,
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