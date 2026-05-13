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
    .populate("sender", "username")
    .sort({ createdAt: 1 })
    .limit(50);

  res.json(messages);
};