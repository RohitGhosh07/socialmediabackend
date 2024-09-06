// const { DataTypes } = require('sequelize');
// const sequelize = require('./index').sequelize;

// const Post = sequelize.define('Post', {
//   content: {
//     type: DataTypes.TEXT,
//     allowNull: true
//   },
//   mediaUrl: {
//     type: DataTypes.STRING, // Can be image or video URL
//     allowNull: false
//   },
//   mediaType: {
//     type: DataTypes.ENUM('image', 'video'),
//     allowNull: false
//   },
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   }
// });

// module.exports = Post;

module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define('Post', {
        content: {
            type: DataTypes.TEXT,
            allowNull: true
          },
          mediaUrl: {
            type: DataTypes.STRING, // Can be image or video URL
            allowNull: false
          },
          mediaType: {
            type: DataTypes.ENUM('image', 'video'),
            allowNull: false
          },
          userId: {
            type: DataTypes.INTEGER,
            allowNull: false
          }
    });
  
    return Post;
  };
  