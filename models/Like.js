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
  