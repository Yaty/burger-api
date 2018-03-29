const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'productsMenus',
    Product: function() {
        return this.hasOne(Product);
    },
    Menu: function() {
        return this.belongsTo(Menu);
    },
    Promotion: function() {
        return this.hasOne(Promotion);
    },
    ProductMenuOrder: function() {
        return this.belongsTo(ProductMenuOrder);
    },
});
