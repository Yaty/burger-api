const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'Role',
    users() {
        return this.belongsToMany(
            require('./User'),
            'RoleMapping',
            'roleId',
            'userId'
        );
    },
});


