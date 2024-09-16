const express = require('express');
const likeController = require('../controllers/likeController');

const router = express.Router();

router.post('/toggle', likeController.toggleLike);


module.exports = router;
