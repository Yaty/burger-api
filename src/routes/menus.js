const {Menu} = require('../controllers');
const logger = require('../utils/logger')('menus-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');

const validations = {};
const accessControl = {};

crud({
    router,
    model: Menu,
    accessControl,
    validations,
    logger,
});

module.exports = router;
