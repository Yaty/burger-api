const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'products',
    MenuProduct: function() {
        return this.belongsToMany(MenuProduct);
    },
});
