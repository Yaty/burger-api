const {AccessToken} = require('../models');
const crud = require('./crud');

module.exports = {
    ...crud(AccessToken),
};

