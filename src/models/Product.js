const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'Product',
    relationships: {
        menus() {
            return this.belongsToMany(
                require('./Menu'), // model
                'ProductMenu', // Table name
                'productId', // foreign keys
                'menuId'
            );
        },
        orders() {
            return this.belongsToMany(
                require('./Order'),
                'OrderProduct',
                'productId',
                'orderId'
            );
        },
    },
});

