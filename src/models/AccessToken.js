const db = require('../db');

module.exports = db.Model.extend({
    tableName: 'AccessToken',
    uuid: true,
    relationships: {
        user() {
            return this.belongsTo(
                require('./User'),
                'userId',
            );
        },
    },
    isValid() {
        const now = new Date();
        const tokenLimitDate = new Date(this.get('created_at'));
        tokenLimitDate.setSeconds(tokenLimitDate.getSeconds() + this.get('ttl'));
        return tokenLimitDate > now;
    },
});

