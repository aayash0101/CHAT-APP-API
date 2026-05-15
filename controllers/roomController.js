import Room from "../models/Room.js";
import Message from "../models/Message.js";

export const getRooms = async (req, res) => {
  const rooms = await Room.find().populate("createdBy", "username");
  res.json(rooms);
};

export const createRoom = async (req, res) => {
  const { name, description } = req.body;

  const roomExists = await Room.findOne({ name });
  if (roomExists) {
    return res.status(400).json({ message: "Room name already exists" });
  }

  const room = await Room.create({
    name,
    description,
    createdBy: req.user._id,
    members: [req.user._id],
  });

  res.status(201).json(room);
};


export const getRoomMessages = async (req, res) => {
  const messages = await Message.find({ room: req.params.roomId })
    .populate("sender", "username avatar displayName")  
    .sort({ createdAt: 1 })
    .limit(50);
  res.json(messages);
};

export const joinRoom = async (req, res) => {
  const room = await Room.findById(req.params.roomId);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const isMember = room.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );

  if (isMember) {
    return res.status(400).json({ message: "Already a member of this room" });
  }

  room.members.push(req.user._id);
  await room.save();

  res.json({ message: "Joined room successfully", room });
};

export const leaveRoom = async (req, res) => {
  const room = await Room.findById(req.params.roomId);

  if (!room) {
    return res.status(404).json({ message: "Room not found" });
  }

  const isMember = room.members.some(
    (memberId) => memberId.toString() === req.user._id.toString()
  );

  if (!isMember) {
    return res.status(400).json({ message: "You are not a member of this room" });
  }

  // Pull user out of members array
  room.members = room.members.filter(
    (memberId) => memberId.toString() !== req.user._id.toString()
  );
  await room.save();

  res.json({ message: "Left room successfully" });
};