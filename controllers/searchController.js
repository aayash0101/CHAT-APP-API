import Room from "../models/Room.js";
import Message from "../models/Message.js";

export const search = async (req, res) => {
  const { q } = req.query;

  if (!q?.trim()) {
    return res.json({ rooms: [], messages: [] });
  }

  const regex = { $regex: q, $options: "i" }; 

  const rooms = await Room.find({
    isDM: { $ne: true },
    $or: [{ name: regex }, { description: regex }],
  })
    .select("name description members")
    .limit(5);

  
  const messages = await Message.find({ content: regex })
    .populate("sender", "username")
    .populate("room", "name isDM")
    .select("content sender room createdAt")
    .sort({ createdAt: -1 })
    .limit(8);

  const filteredMessages = messages.filter((m) => !m.room?.isDM);

  res.json({ rooms, messages: filteredMessages });
};