import Room from "../models/Room.js";
import Message from "../models/Message.js";

export const getOrCreateDM = async (req, res) => {
  const { targetUserId } = req.body;
  const currentUserId = req.user._id;

  if (targetUserId === currentUserId.toString()) {
    return res.status(400).json({ message: "You cannot DM yourself" });
  }

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