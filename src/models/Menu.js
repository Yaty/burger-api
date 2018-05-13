const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'Menu',
    relationships: {
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
        promotions() {
            return this.belongsToMany(
                require('./Promotion'),
                'PromotionMenu',
                'menuId',
                'promotionId'
            );
        },
    },
});

