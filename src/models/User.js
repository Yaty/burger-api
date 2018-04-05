const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'User',
    hidden: ['password'],
    orders() {
        return this.hasMany(
            require('./Order'),
            'userId'
        );
    },
    roles() {
        return this.belongsToMany(
            require('./Role'),
            'RoleMapping',
            'userId',
            'roleId'
        );
    },
    tokens() {
        return this.hasMany(
            require('./AccessToken'),
            'userId'
        );
    },
});
