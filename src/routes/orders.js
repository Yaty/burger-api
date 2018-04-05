const {Order} = require('../controllers');
const logger = require('../utils/logger')('orders-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');

const validations = {};
const accessControl = {
    find: auth.ifAdmin(),
    findById: auth.ifOwner(),
    create: auth.ifAnyone(),
    patch: auth.ifAdmin(),
    update: auth.ifAdmin(),
    delete: auth.ifAdmin(),
    exists: auth.ifAdmin(),
    count: auth.ifAdmin(),
};

crud({
    router,
    model: Order,
    accessControl,
    validations,
    logger,
});

module.exports = router;
