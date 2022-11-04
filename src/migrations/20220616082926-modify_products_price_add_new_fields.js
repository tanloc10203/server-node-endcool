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
        'ProductPrices', // table name
        'isSale', // new field name
        {
          type: Sequelize.BOOLEAN,
        },
      ),
      queryInterface.addColumn(
        'ProductPrices', // table name
        'percentDiscount', // new field name
        {
          type: Sequelize.REAL,
        },
      ),
      queryInterface.addColumn(
        'ProductPrices', // table name
        'priceDiscount', // new field name
        {
          type: Sequelize.REAL,
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
      queryInterface.removeColumn('ProductPrices', 'isSale'),
      queryInterface.removeColumn('ProductPrices', 'percentDiscount'),
      queryInterface.removeColumn('ProductPrices', 'priceDiscount'),
    ]);
  }
};
