const db = require('../db/index');

module.exports = db.Model.extend({
    tableName: 'menus',
});

