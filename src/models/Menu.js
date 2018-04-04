const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'Menu',
    products() {
      return this.belongsToMany(
          require('./Product'), // model
          'ProductMenu', // table name
          'menuId', // foreign keys
          'productId'
      );
    },
    orders() {
        return this.belongsToMany(
            require('./Order'),
            'OrderMenu',
            'menuId',
            'orderId',
        );
    },
    currentPrice: function() {
        const truePrice = this.get('price') - this.get('reductionCost');
        return truePrice <= 0 ? truePrice : 0;
    },
    askForReduction: function(userCategory) {
        switch (userCategory) {

        }
    },
});

