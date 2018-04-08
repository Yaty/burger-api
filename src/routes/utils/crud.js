const _ = require('lodash');
const validate = require('express-validation');
const Joi = require('joi');
const auth = require('../middlewares/auth');

module.exports = function({router, model, validations = {}, accessControl = {}, logger}) {
    // This function will not work properly with bad input
    if (!_.isFunction(router) || !_.isObject(model) || !_.isObject(logger)) {
        const msg = 'CRUD utils needs to have a router, a model, a logger.';

        if (_.isObject(logger)) {
            logger.fatal(msg, {router, model});
        } else {
            console.error(msg, router, model, logger);
        }

        process.exit(0);
    }

    const mandatoryId = {
        params: {
            id: Joi.number().integer().required(),
        },
    };

    // Those are the default validations which could be overridden
    const routerValidations = _.merge({
        find: {},
        findById: mandatoryId,
        create: {},
        patch: mandatoryId,
        update: mandatoryId,
        delete: mandatoryId,
        exists: mandatoryId,
        count: {},
    }, validations);

    const routerAccessControl = _.merge({
        find: auth.ifAnyone(),
        findById: auth.ifAnyone(),
        create: auth.ifAnyone(),
        patch: auth.ifAnyone(),
        update: auth.ifAnyone(),
        delete: auth.ifAnyone(),
        exists: auth.ifAnyone(),
        count: auth.ifAnyone(),
    }, accessControl);

    /**
     * @swagger
     * /{model}:
     *   get:
     *     summary: Get all instances from model
     *     parameters:
     *       - in: path
     *         name: model
     *         type: string
     *         required: true
     *         description: Model name
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: An array of Object
     *         schema:
     *           type: array
     *           items:
     *             type: object
     */
    router.get('/', routerAccessControl.find, validate(routerValidations.find),
        async (req, res, next) => {
            try {
                return res.json(await model.fetchAll());
            } catch (err) {
                next(err);
            }
        });

    /**
     * @swagger
     * /{model}/count:
     *   get:
     *     summary: Count all instances from model
     *     parameters:
     *       - in: path
     *         name: model
     *         type: string
     *         required: true
     *         description: Model name
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Return a counter
     *         schema:
     *           type: object
     *           properties:
     *             count: number
     */
    router.get('/count', routerAccessControl.count, validate(routerValidations.count),
        async (req, res, next) => {
            try {
                const where = req.body.where || {};
                const count = await model.count(where);
                return res.json({count});
            } catch (err) {
                next(err);
            }
        });

    /**
     * @swagger
     * /{model}/{id}:
     *   get:
     *     summary: Find an instance by ID from a model
     *     parameters:
     *       - in: path
     *         name: model
     *         type: string
     *         required: true
     *         description: Model name
     *       - in: path
     *         name: id
     *         type: string
     *         required: true
     *         description: instance id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Return the instance
     *         schema:
     *           type: object
     *       404:
     *         description: Not found
     */
    router.get('/:id', routerAccessControl.findById, validate(routerValidations.findById),
        async (req, res, next) => {
            try {
                const id = req.params.id;
                const data = await model.fetchById(id);

                if (_.isObject(data)) {
                    return res.json(data);
                }

                return res.sendStatus(404);
            } catch (err) {
                next(err);
            }
        });

    /**
     * @swagger
     * /{model}:
     *   post:
     *     summary: Create an instance of a model
     *     parameters:
     *       - in: path
     *         name: model
     *         type: string
     *         required: true
     *         description: Model name
     *     requestBody:
     *       description: data
     *       required: true
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Return the created instance
     *         schema:
     *           type: object
     */
    router.post('/', routerAccessControl.create, validate(routerValidations.create),
        async (req, res, next) => {
            try {
                return res.status(201).json(await model.create(req.body));
            } catch (err) {
                next(err);
            }
        });

    /**
     * Update an instance by it's ID
     * @param {Object} res
     * @param {String} id
     * @param {Object} body
     * @return {Promise.<void>}
     */
    async function update(res, id, body) {
        const updated = await model.updateById(id, body);

        if (_.isObject(updated)) {
            return res.json(updated);
        }

        return res.sendStatus(404);
    }

    /**
     * @swagger
     * /{model}/{id}:
     *   patch:
     *     summary: Update instance attributes by ID from a model
     *     parameters:
     *       - in: path
     *         name: model
     *         type: string
     *         required: true
     *         description: Model name
     *       - in: path
     *         name: id
     *         type: string
     *         required: true
     *         description: instance id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Return the instance
     *         schema:
     *           type: object
     *       404:
     *         description: Not found
     */
    router.patch('/:id', routerAccessControl.patch, validate(routerValidations.patch),
        async (req, res, next) => {
            try {
                await update(res, req.params.id, req.body);
            } catch (err) {
                next(err);
            }
        });

    /**
     * @swagger
     * /{model}/{id}:
     *   put:
     *     summary: Update instance by ID from a model
     *     parameters:
     *       - in: path
     *         name: model
     *         type: string
     *         required: true
     *         description: Model name
     *       - in: path
     *         name: id
     *         type: string
     *         required: true
     *         description: instance id
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Return the instance
     *         schema:
     *           type: object
     *       404:
     *         description: Not found
     */
    router.put('/:id', routerAccessControl.update, validate(routerValidations.update),
        async (req, res, next) => {
            try {
                await update(res, req.params.id, req.body);
            } catch (err) {
                next(err);
            }
        });

    /**
     * @swagger
     * /{model}/{id}:
     *   head:
     *     summary: Check if an instance exists
     *     parameters:
     *       - in: path
     *         name: model
     *         type: string
     *         required: true
     *         description: Model name
     *       - in: path
     *         name: id
     *         type: string
     *         required: true
     *         description: instance id
     *     responses:
     *       200:
     *         description: The instance exists
     *       404:
     *         description: The instance is not found
     */
    router.head('/:id', routerAccessControl.exists, validate(routerValidations.exists),
        async (req, res, next) => {
            try {
                const id = req.params.id;
                const exists = await model.exists(id);
                return res.sendStatus(exists ? 200 : 404);
            } catch (err) {
                next(err);
            }
        });

    /**
     * @swagger
     * /{model}/{id}:
     *   delete:
     *     summary: Delete an instance from a model
     *     parameters:
     *       - in: path
     *         name: model
     *         type: string
     *         required: true
     *         description: Model name
     *       - in: path
     *         name: id
     *         type: string
     *         required: true
     *         description: instance id
     *     responses:
     *       204:
     *         description: Instance deleted
     *       404:
     *         description: Not found
     */
    router.delete('/:id', routerAccessControl.delete, validate(routerValidations.delete),
        async (req, res, next) => {
            try {
                const id = req.params.id;
                const destroyed = await model.destroyById(id);
                if (destroyed) return res.sendStatus(204);
                return res.sendStatus(404);
            } catch (err) {
                next(err);
            }
        });
};
