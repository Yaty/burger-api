const {User} = require('../controllers');
const logger = require('../utils/logger')('users-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');
const auth = require('./middlewares/auth');
const validate = require('express-validation');
const Joi = require('joi');

const options = {
    validations: {},
    accessControl: {
        find: auth.ifAdmin,
        findById: auth.ifOwner,
        create: auth.ifAnyone,
        patch: auth.ifOwner,
        update: auth.ifOwner,
        delete: auth.ifOwner,
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

const loginValidation = {
    body: {
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    },
};

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
router.post('/login', auth.ifAnyone, validate(loginValidation), async (req, res, next) => {
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

module.exports = router;
