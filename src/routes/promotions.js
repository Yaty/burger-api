const {Promotion} = require('../controllers');
const logger = require('../utils/logger')('promotions-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');
const validations = require('./utils/validation');

const options = {
    validations: {
        create: validations.promotions.create,
        patch: validations.promotions.update,
        update: validations.promotions.update,
    },
    accessControl: {
        find: auth.ifAnyone,
        findById: auth.ifAnyone,
        create: auth.ifAdmin,
        patch: auth.ifAdmin,
        update: auth.ifAdmin,
        delete: auth.ifAdmin,
        exists: auth.ifAnyone,
        count: auth.ifAnyone,
    },
};

crud({
    router,
    model: Promotion,
    logger,
    ...options,
});

module.exports = router;
