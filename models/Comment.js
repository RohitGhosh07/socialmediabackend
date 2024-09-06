// const { DataTypes } = require('sequelize');
// const sequelize = require('./index').sequelize;

// const Comment = sequelize.define('Comment', {
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   postId: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   text: {
//     type: DataTypes.TEXT,
//     allowNull: false
//   }
// });

// module.exports = Comment;
module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          postId: {
            type: DataTypes.INTEGER,
            allowNull: false
          },
          text: {
            type: DataTypes.TEXT,
            allowNull: false
          }
    });
  
    return Comment;
  };
  