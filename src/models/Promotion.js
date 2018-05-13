const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'Promotion',
    relationships: {
        menus() {
            return this.belongsToMany(
                require('./Menu'), // model
                'PromotionMenu', // Table name
                'promotionId', // foreign keys
                'menuId'
            );
        },
        products() {
            return this.belongsToMany(
                require('./Product'),
                'PromotionProduct',
                'promotionId',
                'productId'
            );
        },
},
});
