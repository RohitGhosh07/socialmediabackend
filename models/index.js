const { Sequelize } = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

// Initialize Sequelize with database configuration
const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

// Load models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Post = require('./Post')(sequelize, Sequelize.DataTypes);
const Comment = require('./Comment')(sequelize, Sequelize.DataTypes);
const Like = require('./Like')(sequelize, Sequelize.DataTypes);
const Follows = require('./Follows')(sequelize, Sequelize.DataTypes);
const Chats = require('./Chat')(sequelize, Sequelize.DataTypes); // Ensure this is loaded properly
const Message = require('./Message')(sequelize, Sequelize.DataTypes); // Ensure this is loaded properly

// Set up associations
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Comment, { foreignKey: 'postId' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

Post.hasMany(Like, { foreignKey: 'postId' });
Like.belongsTo(Post, { foreignKey: 'postId' });

// Set up user follow associations
User.belongsToMany(User, {
  through: Follows,
  as: 'Followers',       // Alias for followers
  foreignKey: 'followingId',
});

User.belongsToMany(User, {
  through: Follows,
  as: 'Following',       // Alias for following
  foreignKey: 'followerId',
});

// Export models and Sequelize instance
module.exports = {
  sequelize,
  User,
  Post,
  Comment,
  Like,
  Follows,
  Chats,  // Make sure Chat is being exported correctly
  Message,
};
