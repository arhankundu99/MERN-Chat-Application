const express = require('express')
const router = express.Router();

const userController = require('../controllers/user');
const { authMiddleware } = require('../middlewares/auth');

router.route('/register').post(userController.register)
router.route('/login').post(userController.login);
router.route('/').get(authMiddleware, userController.getAllUsers)
router.route('/details').get(authMiddleware, userController.getUser)

module.exports = router;