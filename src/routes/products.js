const {Product} = require('../controllers');
const logger = require('../utils/logger')('products-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');
const Joi = require('joi');

const productValidation = {
    body: {
        price: Joi.number().min(0).required(),
        name: Joi.string().required(),
    },
};

const options = {
    validations: {
        create: productValidation,
        patch: productValidation,
        update: productValidation,
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
