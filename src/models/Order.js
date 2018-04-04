const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'Order',
    products() {
        return this.belongsToMany(
            require('./Product'),
            'OrderProduct',
            'orderId',
            'productId'
        );
    },
    menus() {
        return this.belongsToMany(
            require('./Menu'),
            'OrderMenu',
            'orderId',
            'menuId'
        );
    },
    user() {
        return this.belongsTo(
            require('./User'),
            'userId'
        );
    },
});

