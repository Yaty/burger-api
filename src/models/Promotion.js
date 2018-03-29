const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'promotions',
    MenuProduct: function() {
        return this.belongsToMany(MenuProduct);
    },
    ProductMenuOrder: function() {
        return this.belongsToMany(ProductMenuOrder);
    },
});
