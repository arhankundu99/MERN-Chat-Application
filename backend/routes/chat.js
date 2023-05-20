const express = require('express');
const router = express.Router();
const {authMiddleware} = require("../middlewares/auth")
const chatController = require('../controllers/chat');

router.route('/').post(authMiddleware, chatController.createChat);
router.route('/').get(authMiddleware, chatController.getChats);
router.route('/group').post(authMiddleware, chatController.createGroupChat);
router.route('/group/delete').delete(authMiddleware, chatController.removeGroupChat);
router.route('/group/renameGroup').put(authMiddleware, chatController.renameGroupChat);
router.route('/group/removeUser').put(authMiddleware, chatController.removeUser);
router.route('/group/addUser').put(authMiddleware, chatController.addUser);





module.exports = router;