const db = require('../db');

const Menu = bookshelf.Model.extend({
    tableName: 'menu',

    // getter

    name: function() {
        return this.get('name');
    },

    price: function() {
        return this.get('price');
    },

    reductionName: function() {
        return this.get('reductionName');
    },

    reductionCost: function() {
        return this.get('reductionCost');
    },

    // Other functions

    currentPrice: function() {
        let truePrice = this.get('price') - this.get('reductionCost');
        return truePrice <= 0 ? truePrice : 0;
    },

    askForReduction: function(userCategory) {
        switch (userCategory) {

        }
    },
});

module.exports = db.Model.extend({
    tableName: 'menus',
});

