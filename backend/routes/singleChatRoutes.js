// singleChatRoutes.js

const express = require('express');
const router = express.Router();
const singleChatController = require('../controller/singleChatController');
const auth = require('../middleware/userauth');

router.post('/', auth, singleChatController.sendMessage);
router.get('/:recipientId', auth, singleChatController.getMessages);

module.exports = router;
