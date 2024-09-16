const { Like } = require('../models');

// Toggle like (add if not exists, remove if exists)
exports.toggleLike = async (req, res) => {
  try {
    const { userId, postId } = req.body;

    // Check if the like already exists
    const existingLike = await Like.findOne({ where: { userId, postId } });

    if (existingLike) {
      // If the like exists, remove it
      await Like.destroy({ where: { userId, postId } });
      res.status(200).json({ message: 'Like removed successfully' });
    } else {
      // If the like doesn't exist, add it
      const newLike = await Like.create({ userId, postId });
      res.status(201).json({ newLike, message: 'Like added successfully' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
};
