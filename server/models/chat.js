const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "USER" }],
  },
  { timestamps: true }
);

mongoose.model("CHAT", chatSchema);
