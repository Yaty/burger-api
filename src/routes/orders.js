const {Order} = require('../controllers');
const logger = require('../utils/logger')('orders-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');

const validations = {};

crud(router, Order, validations, logger);

module.exports = router;
