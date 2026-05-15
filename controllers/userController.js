import User from "../models/User.js";
import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";


export const getUserProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "-password -email" 
  );

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

export const updateProfile = async (req, res) => {
  const { displayName, bio } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

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
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.avatarPublicId) {
    await cloudinary.uploader.destroy(user.avatarPublicId);
  }

  user.avatar = req.file.path;
  user.avatarPublicId = req.file.filename;
  await user.save();

  res.json({
    avatar: user.avatar,
    message: "Avatar updated successfully",
  });
};