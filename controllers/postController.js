const { Post, User, Follows } = require('../models');
const upload = require('../middleware/upload'); // Import Multer
const { Sequelize } = require('sequelize'); // Import Sequelize

// Create a new post with media upload
exports.createPost = [
  upload.single('media'), // Handle file upload (field 'media' in form)
  async (req, res) => {
    const { content, mediaType, userId } = req.body;

    try {
      // Server IP and port configuration
      const serverIP = 'http://192.168.50.226:5000'; // Replace with your actual IP and port
      // const serverIP = 'http://192.168.29.166:5000'; // Replace with your actual IP and port

      // Check if the file is uploaded, then save the file path with the full URL
      const mediaUrl = req.file ? `${serverIP}/uploads/${req.file.filename}` : null;

      // Create the post
      const post = await Post.create({ content, mediaUrl, mediaType, userId });

      // Respond with the created post
      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
];

exports.createPostVideo = [
  upload.fields([
    { name: 'media', maxCount: 1 },        // 'media' for the video file
    { name: 'thumbNail', maxCount: 1 }     // 'thumbNail' for the thumbnail image
  ]), // Handle file upload for both video and thumbnail
  async (req, res) => {
    const { content, mediaType, userId } = req.body;

    try {
      // Server IP and port configuration
      // const serverIP = 'http://192.168.29.166:5000'; // Replace with your actual IP and port
      const serverIP = 'http://192.168.50.226:5000'; // Replace with your actual IP and port


      // Get the file paths for both video and thumbnail
      const mediaUrl = req.files.media ? `${serverIP}/uploads/${req.files.media[0].filename}` : null;
      const thumbNailUrl = req.files.thumbNail ? `${serverIP}/uploads/${req.files.thumbNail[0].filename}` : null;

      // Create the post with the media and thumbnail
      const post = await Post.create({ content, mediaUrl, mediaType, userId, thumbNail: thumbNailUrl });

      // Respond with the created post
      res.status(201).json(post);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
];


exports.getPostsByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the user details
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Fetch the posts for the user and calculate the post count
    const postCount = await Post.count({ where: { userId } });

    // Fetch posts in descending order of creation date
    const posts = await Post.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']], // Order by createdAt in descending order
      // include: [User] // Uncomment if you want to include user details within posts
    });

    // Return the user details and posts
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        postCount: postCount // Add post count here
        // Include other user fields as needed
      },
      posts: posts.map(post => ({
        ...post.toJSON(),  // Convert post to JSON
        profilePic: user.profilePic,  // Include user's profilePic
        username: user.username  // Include user's username
      }))
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




// Get all posts in a randomized order (jumbled) with posts from different users
exports.getJumbledPosts = async (req, res) => {
  try {
    // Fetch posts in a randomized order, including associated User data
    const posts = await Post.findAll({
      order: Sequelize.literal('RANDOM()'), // Use RANDOM() for PostgreSQL
      include: [{
        model: User,
        as: 'User', // Use the correct alias defined in your association
        attributes: ['username', 'profilePic'], // Include only username and profilePic
        required: true
      }],
    });

    // Map through the posts and include the user's profilePic and username
    const postsWithUserData = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      mediaUrl: post.mediaUrl,
      createdAt: post.createdAt,
      userId: post.userId,
      thumbNail: post.thumbNail,
      username: post.User.username,
      profilePic: post.User.profilePic,
      mediaType: post.mediaType

    }));

    // Return the posts with user data as a JSON response
    res.status(200).json(postsWithUserData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get posts from users that the current user is following, ordered from latest to oldest
exports.getPostsFromFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the list of user IDs that the current user is following
    const following = await Follows.findAll({
      where: { followerId: userId },
      attributes: ['followingId']
    });

    // Extract just the following IDs from the result
    const followingIds = following.map(follow => follow.followingId);

    if (followingIds.length === 0) {
      return res.status(200).json([]); // If the user is not following anyone, return an empty array
    }

    // Fetch posts from the users that the current user is following
    const posts = await Post.findAll({
      where: {
        userId: followingIds, // Only fetch posts from the users that are being followed
      },
      order: [['createdAt', 'DESC']], // Order by 'createdAt' field in descending order
      include: [{
        model: User,
        as: 'User', // Use the correct alias defined in your association
        attributes: ['username', 'profilePic'], // Include only username and profilePic
        required: true
      }],
    });

    // Map through the posts and include the user's profilePic and username
    const postsWithUserData = posts.map(post => ({
      id: post.id,
      content: post.content,
      mediaUrl: post.mediaUrl,
      createdAt: post.createdAt,
      userId: post.userId,
      // Include user details
      username: post.User.username,
      profilePic: post.User.profilePic
    }));

    // Return the posts with user data as a JSON response
    res.status(200).json(postsWithUserData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
