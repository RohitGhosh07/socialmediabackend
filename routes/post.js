const express = require('express');
const { createPost, getPostsByUser } = require('../controllers/postController');
const router = express.Router();

router.post('/create', createPost);
router.get('/user/:userId', getPostsByUser);

module.exports = router;
