const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'orders',
    User: function() {
        return this.belongsTo(User);
    },
    ProductMenuOrder: function() {
        return this.hasMany(ProductMenuOrder);
    },
});
