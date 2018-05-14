const {Product} = require('../controllers');
const logger = require('../utils/logger')('products-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');
const validations = require('./utils/validation');
const validate = require('express-validation');

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

/**
 * @swagger
 * /products/:id/promotions:
 *   get:
 *     summary: Get product promotions
 *     responses:
 *       200:
 *         description: Promotions
 *       404:
 *         description: Unknown product
 */
router.get('/:id/promotions', validate(validations.mandatoryId), auth.ifAnyone, async (req, res, next) => {
    try {
        const product = await Product.fetchById(req.params.id, true, {withRelated: 'promotions'});

        if (product) {
            return res.json(product.promotions || []);
        }

        return res.sendStatus(404);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
