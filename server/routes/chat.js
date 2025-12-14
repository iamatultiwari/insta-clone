const express = require("express");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");

const CHAT = mongoose.model("CHAT");
const MESSAGE = mongoose.model("MESSAGE");

const router = express.Router();

// create or get chat
router.post("/chat", requireLogin, async (req, res) => {
  const { userId } = req.body;

  let chat = await CHAT.findOne({
    users: { $all: [req.user._id, userId] }
  });

  if (!chat) {
    chat = await CHAT.create({ users: [req.user._id, userId] });
  }

  res.json(chat);
});

// send message
router.post("/message", requireLogin, async (req, res) => {
  const { chatId, text } = req.body;

  const message = await MESSAGE.create({
    chatId,
    sender: req.user._id,
    text
  });

  res.json(message);
});

// get messages
router.get("/message/:chatId", requireLogin, async (req, res) => {
  const messages = await MESSAGE.find({ chatId: req.params.chatId })
    .populate("sender", "_id name");

  res.json(messages);
});

module.exports = router;
