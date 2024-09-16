const { Comment, User } = require('../models');
// Call associate function to create relationships
User.associate({ Comment });
Comment.associate({ User });
// Add a comment
exports.addComment = async (req, res) => {
    try {
        const { userId, postId, text } = req.body;
        const newComment = await Comment.create({ userId, postId, text });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add comment' });
    }
};

// Get comments for a post along with user information
exports.getComments = async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.findAll({
            where: { postId },
            include: [
                {
                    model: User,
                    as: 'user', // Ensure alias is correctly set in the model
                    attributes: ['username', 'profilePic'] // Only select username and profilePic
                }
            ]
        });

        res.status(200).json(comments);
    } catch (error) {
        console.error(error); // To see the error in the console
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};



// Remove a comment
exports.removeComment = async (req, res) => {
    try {
        const { id } = req.params;
        await Comment.destroy({ where: { id } });
        res.status(200).json({ message: 'Comment removed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove comment' });
    }
};
