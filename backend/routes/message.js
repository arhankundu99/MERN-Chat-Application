const express = require("express");
const messageController = require("../controllers/message");
const {authMiddleware} = require("../middlewares/auth");

const router = express.Router();

router.route("/:chatId").get(authMiddleware, messageController.fetchMessages);
router.route("/").post(authMiddleware, messageController.sendMessage);

module.exports = router;