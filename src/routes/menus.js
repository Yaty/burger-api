const {Menu} = require('../controllers');
const logger = require('../utils/logger')('menus-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');
const Joi = require('joi');

const menuValidation = {
    body: {
        name: Joi.string().required(),
    },
};

const options = {
    validations: {
        create: menuValidation,
        patch: menuValidation,
        update: menuValidation,
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
    model: Menu,
    logger,
    ...options,
});

router.get('/:id/products', auth.ifAnyone, async (req, res, next) => {
    try {
        const menu = await Menu.fetchById(req.params.id, true, {withRelated: 'products'});

        if (menu && menu.products) {
            return res.json(menu.products);
        }

        return res.sendStatus(404);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
