const {Role} = require('../models');
const crud = require('./crud');

module.exports = {
    ...crud(Role),
};

