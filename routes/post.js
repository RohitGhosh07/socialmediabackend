const express = require('express');
const { createPost, getPostsByUser,getJumbledPosts,getPostsFromFollowing,createPostVideo } = require('../controllers/postController');
const router = express.Router();

router.post('/create', createPost);
router.get('/user/:userId', getPostsByUser);
router.get('/posts/jumbled', getJumbledPosts);
router.get('/posts/following/:userId', getPostsFromFollowing);
router.post('/video', createPostVideo);



module.exports = router;
