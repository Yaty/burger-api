const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'users',
    Order: function() {
        return this.hasMany(Order);
    },
});
