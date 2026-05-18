import Message from "../models/Message.js";

export const markAsRead = async (req, res) => {
  const { roomId } = req.params;
  const userId = req.user._id;

  await Message.updateMany(
    {
      room: roomId,
      sender: { $ne: userId },       
      readBy: { $ne: userId },        
    },
    {
      $addToSet: { readBy: userId },  
    }
  );

  res.json({ message: "Messages marked as read" });
};