const {User} = require('../controllers');
const logger = require('../utils/logger')('users-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');
const validate = require('express-validation');
const validations = require('./utils/validation');

const options = {
    validations: {
        create: validations.users.create,
        update: validations.users.update,
        patch: validations.users.update,
    },
    accessControl: {
        find: auth.ifAdmin,
        findById: auth.ifOwner(User),
        create: auth.ifAnyone,
        patch: auth.ifOwner(User),
        update: auth.ifOwner(User),
        delete: auth.ifOwner(User),
        exists: auth.ifAdmin,
        count: auth.ifAdmin,
    },
};

crud({
    router,
    model: User,
    logger,
    ...options,
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: password
 *         in: body
 *         required: true
 *         type: string
 *         format: password
 *       - name: username
 *         in: body
 *         required: true
 *         type: string
 *     produces:
 *       - application/json
 *     responses:
 *       201:
 *         description: The access token
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             ttl:
 *               type: number
 *             created_at:
 *               type: string
 *       401:
 *         description: Login failed
 */
router.post('/login', auth.ifAnyone, validate(validations.users.login), async (req, res, next) => {
        try {
            return res.json(await User.login(req.body.email, req.body.password));
        } catch (err) {
            next(err);
        }
    });

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout
 *     responses:
 *       204:
 *         description: Logout success
 *       401:
 *         description: Logout failed
 */
router.post('/logout', auth.ifAuthenticated, async (req, res, next) => {
    try {
        await User.logout(res.locals.token);
        return res.sendStatus(204);
    } catch (err) {
        next(err);
    }
});

/**
 * @swagger
 * /users/:id/orders:
 *   get:
 *     summary: Get user orders
 *     responses:
 *       200:
 *         description: Orders
 *       404:
 *         description: User not found
 */
router.get('/:id/orders', validate(validations.mandatoryId), auth.ifOwner(User), async (req, res, next) => {
    try {
        const user = await User.fetchById(req.params.id, true, {withRelated: ['orders']});

        if (user) {
            return res.json(user.orders || []);
        }

        return res.sendStatus(404);
    } catch (err) {
        next(err);
    }
});

module.exports = router;
