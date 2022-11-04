'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Addresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      provinceCode: {
        type: Sequelize.STRING
      },
      provinceName: {
        type: Sequelize.STRING
      },
      districtCode: {
        type: Sequelize.STRING
      },
      districtName: {
        type: Sequelize.STRING
      },
      wardCode: {
        type: Sequelize.STRING
      },
      wardName: {
        type: Sequelize.STRING
      },
      memberId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Members', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Addresses');
  }
};