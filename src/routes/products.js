const {Product} = require('../controllers');
const logger = require('../utils/logger')('products-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');

const validations = {};
const accessControl = {};

crud({
    router,
    model: Product,
    accessControl,
    validations,
    logger,
});

module.exports = router;
