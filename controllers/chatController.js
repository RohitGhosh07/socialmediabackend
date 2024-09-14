const { Op } = require('sequelize');
const { Chats, User, Message } = require('../models');

// Create or get an existing chat
exports.createOrGetChat = async (req, res) => {
  const { userId, otherUserId } = req.body;

  try {
    // Find a chat that contains both participants
    let chat = await Chats.findOne({
      where: {
        participants: {
          [Op.contains]: [userId, otherUserId], // Chat must contain both userId and otherUserId
        },
      },
    });

    // If chat doesn't exist, create a new one
    if (!chat) {
      chat = await Chats.create({ participants: [userId, otherUserId] });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error('Error creating or retrieving chat:', error);
    res.status(500).json({ error: 'Error creating or retrieving chat', details: error.message });
  }
};

// Get messages for a specific chat
exports.getChatMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.findAll({
      where: { chatId },
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Error fetching messages', details: error.message });
  }
};

// Send a new message
exports.sendMessage = async (req, res) => {
  const { chatId } = req.params;
  const { senderId, text } = req.body;

  try {
    const message = await Message.create({
      chatId,
      senderId,
      text,
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error sending message', details: error.message });
  }
};

// Utility to format time (formatted to "7:00 PM")
const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

// API to get all chat IDs and the other user's details for a specific user
exports.getAllChatsWithOppositeUser = async (req, res) => {
    const { userId } = req.params; // Extract the current user ID from request parameters

    try {
        // Find all chats that include the current user in participants array
        const chats = await Chats.findAll({
            where: {
                participants: {
                    [Op.contains]: [parseInt(userId)], // Check if the user is a participant in the array
                },
            },
            attributes: ['id', 'participants'], // Return chat ID and participants
        });

        if (!chats || chats.length === 0) {
            return res.status(404).json({ error: 'No chats found for this user' });
        }

        // For each chat, find the other user (the one that is not the current user) and the last message
        const chatDetails = await Promise.all(chats.map(async (chat) => {
            const otherUserId = chat.participants.find(id => id !== parseInt(userId)); // Find the other user

            if (!otherUserId) return null; // Skip if no other user is found

            // Find the other user's details (username, profilePic, etc.)
            const otherUser = await User.findOne({
                where: { id: otherUserId },
                attributes: ['id', 'username', 'profilePic'], // Select relevant details
            });

            if (!otherUser) return null; // Skip if the other user doesn't exist

            // Find the last message in this chat
            const lastMessage = await Message.findOne({
                where: { chatId: chat.id },
                order: [['createdAt', 'DESC']], // Order by createdAt to get the latest message
                attributes: ['text', 'createdAt'], // Return message text and createdAt time
            });

            return {
                chatId: chat.id,
                otherUser,
                lastMessage: lastMessage ? lastMessage.text : null, // Return the last message text or null if no message
                lastMessageTime: lastMessage ? formatTime(lastMessage.createdAt) : null, // Format the time
                lastMessageTimestamp: lastMessage ? lastMessage.createdAt : null, // Store raw timestamp for sorting
            };
        }));

        // Filter out any null values and sort by latest message time (newest to oldest)
        const validChatDetails = chatDetails
            .filter(detail => detail !== null)
            .sort((a, b) => {
                // Sort by lastMessageTimestamp, null values (no message) will go at the end
                if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
                    return new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp);
                }
                return a.lastMessageTimestamp ? -1 : 1;
            });

        res.status(200).json(validChatDetails); // Return the valid chat details, sorted by latest message
    } catch (error) {
        console.error('Error fetching chats with opposite user details:', error);
        res.status(500).json({ error: 'Error fetching chats with opposite user details', details: error.message });
    }
};