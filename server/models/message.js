const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "CHAT" },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "USER" },
    text: String,
  },
  { timestamps: true }
);

mongoose.model("MESSAGE", messageSchema);
