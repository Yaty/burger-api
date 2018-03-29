const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'productsMenusOrders',
    Order: function() {
        return this.hasOne(Order);
    },
    Promotion: function() {
        return this.hasOne(Promotion);
    },
    MenuProduct: function() {
        return this.hasMany(MenuProduct);
    },
});
