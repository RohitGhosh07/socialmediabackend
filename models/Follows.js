// models/Follows.js
module.exports = (sequelize, DataTypes) => {
  const Follows = sequelize.define('Follows', {
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  });

  return Follows;
};