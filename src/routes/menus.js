const {Menu} = require('../controllers');
const logger = require('../utils/logger')('menus-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');

const validations = {};
const accessControl = {
    find: auth.ifAnyone(),
    findById: auth.ifAnyone(),
    create: auth.ifAdmin(),
    patch: auth.ifAdmin(),
    update: auth.ifAdmin(),
    delete: auth.ifAdmin(),
    exists: auth.ifAnyone(),
    count: auth.ifAnyone(),
};

crud({
    router,
    model: Menu,
    accessControl,
    validations,
    logger,
});

module.exports = router;
