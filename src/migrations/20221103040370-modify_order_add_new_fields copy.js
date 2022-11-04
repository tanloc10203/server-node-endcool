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
        'isEvaluate', // new field name
        {
          allowNull: false,
          type: Sequelize.BOOLEAN(),
          defaultValue: false,
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
      queryInterface.removeColumn(
        'Orders', // table name
        'isEvaluate', // new field name
        {
          allowNull: false,
          type: Sequelize.BOOLEAN(),
          defaultValue: false,
        },
      ),
    ]);
  }
};
