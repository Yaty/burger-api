const {Order} = require('../models');
const crud = require('./utils/crud');

module.exports = {
    ...crud(Order),
};
