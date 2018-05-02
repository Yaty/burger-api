const {Product} = require('../controllers');
const logger = require('../utils/logger')('products-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');
const validations = require('./utils/validation');

const options = {
    validations: {
        create: validations.products.create,
        patch: validations.products.update,
        update: validations.products.update,
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
    model: Product,
    logger,
    ...options,
});

module.exports = router;
