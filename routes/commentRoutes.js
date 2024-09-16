const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router();

// Route to add a comment
router.post('/add', commentController.addComment);

// Route to get comments for a specific post
router.get('/:postId', commentController.getComments);

// Route to remove a comment
router.delete('/:id', commentController.removeComment);

module.exports = router;
