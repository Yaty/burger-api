const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'AccessToken',
    uuid: true,
    user() {
        return this.belongsTo(
            require('./User'),
            'userId',
        );
    },
    isValid() {
        const now = new Date();
        const created = new Date(this.get('created_at'));
        const ttl = this.get('ttl');
        const tokenLimitDate = created + ttl;
        return tokenLimitDate < now;
    },
});

