const { User,Follows } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize'); // Import Op from sequelize


// Register a new user
exports.register = async (req, res) => {
  const { username, email, password, bio } = req.body;

  // Log the incoming request body for debugging purposes
  console.log("Received registration request with data: ", req.body);

  try {
    // Check if the user already exists
    console.log("Checking if user exists with email: ", email);
    const userExists = await User.findOne({ where: { email } });
    
    if (userExists) {
      console.log("User already exists with email: ", email);
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create the user with the plain text password (not recommended for production)
    console.log("Creating a new user with username: ", username);
    const user = await User.create({
      username,
      email,
      password,  // Store the plain text password
      bio
    });

    // Log success
    console.log("User successfully created: ", user);

    // Respond with the created user data
    res.status(201).json({ user, message: 'User registered successfully' });
    
  } catch (err) {
    // Log the error with the full stack trace for more detail
    console.error("Error during user registration: ", err.stack);
    
    // Respond with detailed error message
    res.status(400).json({ error: err.message, details: err });
  }
};
// User login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });

    // If the user doesn't exist
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Compare the entered plain text password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a token (you can adjust the expiry time as needed)
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Respond with the token and user data
    res.json({ token, message: 'Logged in successfully', user });

  } catch (err) {
    // Log the error and send a 500 status with the error message
    console.error("Error during login: ", err.stack);
    res.status(500).json({ error: err.message });
  }
};




exports.getProfile = async (req, res) => {
  const { userId, profileId } = req.body; // Get both userId and profileId from the request body

  try {
    // Fetch the profile of the requested user (profileId)
    const user = await User.findByPk(profileId, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the logged-in user is following the requested profile (profileId)
    const isFollowing = await Follows.findOne({
      where: {
        followerId: userId, // Logged-in user
        followingId: profileId // Profile being requested
      }
    });

    // Check if the requested profile (profileId) is following the logged-in user
    const isFollower = await Follows.findOne({
      where: {
        followerId: profileId, // Profile being requested
        followingId: userId // Logged-in user
      }
    });

    // Add the `following` and `follower` flags based on the checks
    const profileData = {
      ...user.toJSON(),
      following: !!isFollowing, // true if following, false if not
      follower: !!isFollower // true if the profile is following the user
    };

    // Send the profile data along with the follow status
    res.status(200).json({ user: profileData, message: 'User profile fetched successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//search
exports.searchProfile = async (req, res) => {
  const { query } = req.query; // The search term is passed as a query parameter

  try {
    // Search for users whose username or email matches the search query
    const users = await User.findAll({
      where: {
        [Op.or]: [ // Use Op from sequelize
          {
            username: {
              [Op.like]: `%${query}%`,  // Search for partial matches in the username
            },
          },
          {
            email: {
              [Op.like]: `%${query}%`,  // Search for partial matches in the email
            },
          },
        ],
      },
      attributes: ['id', 'username', 'email', 'bio', 'profilePic'], // Fields to return
    });

    // If no users are found
    if (!users.length) {
      return res.status(404).json({ message: 'No users found' });
    }

    // Return the matching users
    res.status(200).json({ users, message: 'Search results' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
//follow
exports.toggleFollowUser = async (req, res) => {
  const { followerId, followingId } = req.body;

  try {
    // Prevent user from following themselves
    if (followerId === followingId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Fetch the user details for the following user
    const followingUser = await User.findOne({ where: { id: followingId } });

    if (!followingUser) {
      return res.status(404).json({ message: "User to follow/unfollow not found" });
    }

    // Check if the follow relationship already exists
    const follow = await Follows.findOne({
      where: { followerId, followingId },
    });

    // If follow exists, unfollow (destroy the relationship)
    if (follow) {
      await follow.destroy();
      return res.status(200).json({ 
        message: `You have unfollowed ${followingUser.username}`, 
        action: "unfollowed" 
      });
    }

    // If follow does not exist, create a new follow record
    await Follows.create({ followerId, followingId });
    return res.status(201).json({ 
      message: `You are now following ${followingUser.username}`, 
      action: "followed" 
    });

  } catch (err) {
    // Handle errors
    return res.status(500).json({ error: err.message });
  }
};

exports.getFollowers = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      include: [{ model: User, as: 'Followers', attributes: ['id', 'username', 'email','profilePic'] }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followerCount = user.Followers.length;

    res.status(200).json({ 
      followerCount, 
      followers: user.Followers 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getFollowing = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByPk(userId, {
      include: [{ model: User, as: 'Following', attributes: ['id', 'username', 'email','profilePic'] }],
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const followingCount = user.Following.length;

    res.status(200).json({ 
      followingCount, 
      following: user.Following 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
