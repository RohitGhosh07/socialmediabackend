const express = require('express');
const { register, login, getProfile,toggleFollowUser,getFollowers,getFollowing,searchProfile } = require('../controllers/userController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/profile', getProfile);
router.get('/search', searchProfile); // Endpoint for searching users

// Follow and unfollow routes
router.post('/toggleFollowUser', toggleFollowUser);

// Fetch followers and following
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);


module.exports = router;
