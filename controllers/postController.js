const { Post, User, Follows } = require('../models');
const upload = require('../middleware/upload'); // Import Multer
const { Sequelize } = require('sequelize'); // Import Sequelize
const Like = require('../models/Like');

// Create a new post with media upload
exports.createPost = [
  upload.single('media'), // Handle file upload (field 'media' in form)
  async (req, res) => {
    const { content, mediaType, userId } = req.body;

    try {
      // Server IP and port configuration
      const serverIP = 'http://3.84.246.113:5000'; // Replace with your actual IP and port
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
      const serverIP = 'http://3.84.246.113:5000'; // Replace with your actual IP and port


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

    // Fetch the post count for the user
    const postCount = await Post.count({ where: { userId } });

    // Fetch the posts with the like count
    const posts = await Post.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']], // Order posts by creation date
      attributes: {
        include: [
          // Include the count of likes for each post
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "Likes" AS "like"
              WHERE "like"."postId" = "Post"."id"
            )`),
            'likeCount'
          ]
        ]
      },
    });

    // Construct the response
    res.status(200).json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        profilePic: user.profilePic,
        postCount: postCount, // Post count included
      },
      posts: posts.map(post => ({
        ...post.toJSON(),  // Convert each post instance to JSON
        profilePic: user.profilePic,  // Include user's profilePic in each post
        username: user.username,  // Include user's username in each post
        likeCount: post.get('likeCount'),  // Get the like count for each post
      })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





exports.getJumbledPosts = async (req, res) => {
  try {
    // Fetch posts in a randomized order, including associated User data and like count
    const posts = await Post.findAll({
      order: Sequelize.literal('RANDOM()'), // Use RANDOM() for PostgreSQL
      include: [{
        model: User,
        as: 'User', // Use the correct alias defined in your association
        attributes: ['username', 'profilePic'], // Include only username and profilePic
        required: true
      }],
      attributes: {
        include: [
          // Include the count of likes for each post
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "Likes" AS "like"
              WHERE "like"."postId" = "Post"."id"
            )`),
            'likeCount'
          ]
        ]
      },
    });

    // Map through the posts and include the user's profilePic, username, and likeCount
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
      mediaType: post.mediaType,
      likeCount: post.get('likeCount')  // Get the like count for each post
    }));

    // Return the posts with user data and like count as a JSON response
    res.status(200).json(postsWithUserData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getPostsFromFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch the list of user IDs that the current user is following
    const following = await Follows.findAll({
      where: { followerId: userId },
      attributes: ['followingId'],
    });

    // Extract the following IDs from the result
    const followingIds = following.map(follow => follow.followingId);

    if (followingIds.length === 0) {
      return res.status(200).json([]); // If the user is not following anyone, return an empty array
    }

    // Fetch posts from the users that the current user is following
    const posts = await Post.findAll({
      where: {
        userId: followingIds, // Fetch posts from the followed users
      },
      order: [['createdAt', 'DESC']], // Order posts by createdAt in descending order
      include: [
        {
          model: User,
          as: 'User', // Alias defined in your model association
          attributes: ['username', 'profilePic'], // Include only username and profilePic
          required: true,
        },
      ],
      attributes: {
        include: [
          // Include the count of likes for each post using Sequelize.literal
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "Likes" AS "like"
              WHERE "like"."postId" = "Post"."id"
            )`),
            'likeCount'
          ]
        ]
      },
    });

    // Map through the posts and include the user's profilePic and username
    const postsWithUserData = posts.map(post => ({
      id: post.id,
      content: post.content,
      mediaUrl: post.mediaUrl,
      createdAt: post.createdAt,
      userId: post.userId,
      username: post.User.username,
      profilePic: post.User.profilePic,
      title: post.title,
      thumbNail: post.thumbNail,
      mediaType: post.mediaType,
      likeCount: post.get('likeCount'), // Get the like count for each post
    }));

    // Return the posts with user data as a JSON response
    res.status(200).json(postsWithUserData);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
