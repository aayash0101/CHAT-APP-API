import User from "../models/User.js";
import { v2 as cloudinary } from "cloudinary";

export const getUserProfile = async (req, res) => {
    const user = await User.findById(req.params.id).select("-password -email");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
};

export const updateProfile = async (req, res) => {
    const { displayName, bio } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    const updated = await user.save();
    res.json({
        _id: updated._id,
        username: updated.username,
        email: updated.email,
        displayName: updated.displayName,
        bio: updated.bio,
        avatar: updated.avatar,
        isOnline: updated.isOnline,
    });
};

export const uploadAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        console.log("req.file:", JSON.stringify(req.file, null, 2)); // keep this

        const user = await User.findById(req.user._id); // ← only once
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.avatarPublicId) {
            await cloudinary.uploader.destroy(user.avatarPublicId);
        }

        user.avatar = req.file.path;
        user.avatarPublicId = req.file.filename;
        await user.save();

        res.json({ avatar: user.avatar, message: "Avatar updated successfully" });
    } catch (err) {
        console.error("uploadAvatar error:", err);
        res.status(500).json({ message: err.message });
    }
};


export const searchUsers = async (req, res) => {
  const { q } = req.query;
  if (!q?.trim()) return res.json([]);

  const users = await User.find({
    username: { $regex: q, $options: "i" }, 
    _id: { $ne: req.user._id },             
  })
    .select("username displayName avatar isOnline")
    .limit(10);

  res.json(users);
};