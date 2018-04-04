const {Menu} = require('../models');
const crud = require('./utils/crud');

module.exports = {
    ...crud(Menu),
};
