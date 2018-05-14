const {Order} = require('../controllers');
const logger = require('../utils/logger')('orders-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');
const validate = require('express-validation');
const validations = require('./utils/validation');

const options = {
    validations: {
        create: validations.orders.create,
        patch: validations.orders.update,
        update: validations.orders.update,
    },
    accessControl: {
        find: auth.ifAdmin,
        findById: auth.ifOwner(Order),
        create: auth.ifAnyone,
        patch: auth.ifAdmin,
        update: auth.ifAdmin,
        delete: auth.ifAdmin,
        exists: auth.ifAdmin,
        count: auth.ifAdmin,
    },
    insertUserId: true,
};

crud({
    router,
    model: Order,
    logger,
    ...options,
});

/**
 * @swagger
 * /orders/:id/products:
 *   get:
 *     summary: Get order products
 *     responses:
 *       200:
 *         description: Products
 *       404:
 *         description: Unknown order
 */
router.get('/:id/products', validate(validations.mandatoryId), auth.ifOwner(Order), async (req, res, next) => {
    try {
        const order = await Order.fetchById(req.params.id, true, {withRelated: ['products']});

        if (order) {
            return res.json(order.products || []);
        }

        return res.sendStatus(404);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /orders/:id/menus:
 *   get:
 *     summary: Get order menus
 *     responses:
 *       200:
 *         description: Menus
 *       404:
 *         description: Unknown order
 */
router.get('/:id/menus', validate(validations.mandatoryId), auth.ifOwner(Order), async (req, res, next) => {
    try {
        const order = await Order.fetchById(req.params.id, true, {withRelated: ['menus']});

        if (order) {
            return res.json(order.menus || []);
        }

        return res.sendStatus(404);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
