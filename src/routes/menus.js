const {Menu} = require('../controllers');
const logger = require('../utils/logger')('menus-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');
const validate = require('express-validation');
const validations = require('./utils/validation');

const options = {
    validations: {
        create: validations.menus.create,
        patch: validations.menus.update,
        update: validations.menus.update,
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

/**
 * @swagger
 * /menus/:id/products:
 *   get:
 *     summary: Get menu products
 *     responses:
 *       200:
 *         description: Products
 *       404:
 *         description: Unknown menu
 */
router.get('/:id/products', validate(validations.mandatoryId), auth.ifAnyone, async (req, res, next) => {
    try {
        const menu = await Menu.fetchById(req.params.id, true, {withRelated: 'products'});

        if (menu) {
            return res.json(menu.products || []);
        }

        return res.sendStatus(404);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /menus/:id/promotions:
 *   get:
 *     summary: Get menu promotions
 *     responses:
 *       200:
 *         description: Products
 *       404:
 *         description: Unknown menu
 */
router.get('/:id/promotions', validate(validations.mandatoryId), auth.ifAnyone, async (req, res, next) => {
    try {
        const menu = await Menu.fetchById(req.params.id, true, {withRelated: 'promotions'});

        if (menu) {
            return res.json(menu.promotions || []);
        }

        return res.sendStatus(404);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
