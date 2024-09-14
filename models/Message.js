module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
      chatId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      timestamps: true, // Enable createdAt and updatedAt
    });
  
    return Message;
  };
  