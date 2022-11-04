'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn(
        'Orders', // table name
        'statusId', // new field name
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'PurchaseStatuses', // name of Target model
            key: 'id', // key in Target model that we're referencing
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          allowNull: true,
        },
      ),
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn('Orders', 'statusId'),
    ]);
  }
};
