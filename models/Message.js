import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    fileUrl: { type: String, default: "" },
    fileType: { type: String, default: "" },
    fileName: { type: String, default: "" },
    fileSize: { type: Number, default: 0 },

    // Array of user IDs who have read this message
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;