const { Post, User } = require('../models');

// Create a new post
exports.createPost = async (req, res) => {
  const { content, mediaUrl, mediaType, userId } = req.body;

  try {
    const post = await Post.create({ content, mediaUrl, mediaType, userId });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get posts by user
exports.getPostsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const posts = await Post.findAll({ where: { userId }, include: [User] });
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
