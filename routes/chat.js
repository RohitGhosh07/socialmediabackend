const express = require('express');
const router = express.Router();
const { createOrGetChat, getChatMessages, sendMessage,getAllChatsWithOppositeUser } = require('../controllers/chatController');
// Route to create or retrieve a chat between two users
router.post('/chats', createOrGetChat);

// Route to get messages for a specific chat
router.get('/chats/:chatId/messages', getChatMessages);

// Route to send a message in a chat
router.post('/chats/:chatId/messages', sendMessage);
router.get('/chats/:userId/ids',getAllChatsWithOppositeUser);


module.exports = router;
