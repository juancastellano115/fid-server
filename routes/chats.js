const express = require("express");
const router = express.Router();
const messageChat = require('../controllers/chatController')
const auth = require('../middleware/auth');
router.post('/specificConversation', auth, messageChat.getMessages);
router.get('/conversaciones',auth, messageChat.get_conversations);
router.post('/seen',auth, messageChat.updateMessageSeen);

module.exports = router