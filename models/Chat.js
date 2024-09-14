module.exports = (sequelize, DataTypes) => {
    const Chats = sequelize.define('Chats', {
      participants: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of user IDs
        allowNull: false,
      },
    }, {
      timestamps: true, // Enable createdAt and updatedAt
    });
  
    return Chats;
  };
  