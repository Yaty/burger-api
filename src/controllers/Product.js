const {Product} = require('../models');
const crud = require('./crud');

module.exports = {
    ...crud(Product),
};
