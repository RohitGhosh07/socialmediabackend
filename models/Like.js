// const { DataTypes } = require('sequelize');
// const sequelize = require('./index').sequelize;

// const Like = sequelize.define('Like', {
//   userId: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   },
//   postId: {
//     type: DataTypes.INTEGER,
//     allowNull: false
//   }
// });

// module.exports = Like;
module.exports = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        postId: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      });  
    return Like;
  };
  