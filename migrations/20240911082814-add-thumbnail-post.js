'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'thumbNail' column to the 'Posts' table
    await queryInterface.addColumn('Posts', 'thumbNail', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the 'thumbNail' column from the 'Posts' table
    await queryInterface.removeColumn('Posts', 'thumbNail');
  }
};
