const {Product} = require('../models');
const crud = require('./utils/crud');

module.exports = crud(Product);
