const {Menu} = require('../models');
const crud = require('./crud');

module.exports = {
    ...crud(Menu),
};
