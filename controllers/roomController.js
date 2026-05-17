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

export const getOrCreateDM = async (req, res) => {
  const { targetUserId } = req.body;
  const currentUserId = req.user._id;

  if (targetUserId === currentUserId.toString()) {
    return res.status(400).json({ message: "You cannot DM yourself" });
  }

  // Check if a DM already exists between these two users
  const existing = await Room.findOne({
    isDM: true,
    participants: { $all: [currentUserId, targetUserId] },
  }).populate("participants", "username avatar displayName isOnline");

  if (existing) return res.json(existing);

  const sortedIds = [currentUserId.toString(), targetUserId].sort();
  const dmName = `dm_${sortedIds[0]}_${sortedIds[1]}`;

  const dm = await Room.create({
    name: dmName,
    isDM: true,
    participants: [currentUserId, targetUserId],
    members: [currentUserId, targetUserId],
    createdBy: currentUserId,
  });

  const populated = await dm.populate("participants", "username avatar displayName isOnline");
  res.status(201).json(populated);
};


export const getMyDMs = async (req, res) => {
  const dms = await Room.find({
    isDM: true,
    participants: req.user._id,
  })
    .populate("participants", "username avatar displayName isOnline")
    .sort({ updatedAt: -1 }); 

  res.json(dms);
};

export const getDMMessages = async (req, res) => {
  const dm = await Room.findOne({
    _id: req.params.dmId,
    isDM: true,
    participants: req.user._id,
  });

  if (!dm) {
    return res.status(404).json({ message: "DM not found" });
  }

  const messages = await Message.find({ room: req.params.dmId })
    .populate("sender", "username avatar displayName")
    .sort({ createdAt: 1 })
    .limit(50);

  res.json(messages);
};