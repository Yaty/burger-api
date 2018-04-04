const {Role} = require('../models');
const crud = require('./utils/crud');

module.exports = {
    ...crud(Role),
};

