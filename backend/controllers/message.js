const asyncHandler = require("express-async-handler");
const messageModel = require('../models/message');
const userModel = require("../models/user");
const chatModel = require("../models/chat");


const fetchMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await messageModel.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    return res.status(200).send(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  let newMessage = {
    sender: req.userId,
    content: content,
    chat: chatId,
  };

  try {
    let message = await messageModel.create(newMessage);

    message = await message.populate("sender", "name pic")
    message = await message.populate("chat")
    message = await userModel.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await chatModel.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

    return res.status(200).send(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { fetchMessages, sendMessage };