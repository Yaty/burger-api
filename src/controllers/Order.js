const {Order} = require('../models');
const crud = require('./crud');

module.exports = {
    ...crud(Order),
};
