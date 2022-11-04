'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductPrices', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
      },
      price: {
        type: Sequelize.REAL
      },
      productId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Products', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false
      },
      timeChangeId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'TimeChanges', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
      .then(() => {
        return queryInterface.sequelize.query('ALTER TABLE ONLY "ProductPrices"  ADD CONSTRAINT "ID_P_KEY" PRIMARY KEY ("productId" , "timeChangeId", "id");');
      })

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductPrices');
  }
};