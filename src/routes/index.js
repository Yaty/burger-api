const menus = require('./menus');
const orders = require('./orders');
const products = require('./products');
const users = require('./users');
const express = require('express');
const router = new express.Router();
const created = new Date();
const packageJson = require('../../package.json');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const basePath = path.resolve(__dirname, '..');
const swaggerJSDoc = require('swagger-jsdoc')({
    swaggerDefinition: {
        info: {
            title: packageJson.name,
            version: packageJson.version,
        },
        host: 'localhost:3000',
        basePath: '/v' + packageJson.version.split('.')[0],
    },
    apis: [
        path.join(basePath, 'routes/**/*.js'),
        path.join(basePath, 'routes/*.js'),
    ],
});

/**
 * @swagger
 * /:
 *   get:
 *     description: Get API information
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: API data
 *         schema:
 *           type: object
 *           properties:
 *             created:
 *               type: string
 *               description: a date
 *             uptime:
 *               type: number
 */
router.get('/', (req, res) => {
    return res.json({
        created,
        uptime: process.uptime(),
    });
});

router.use('/menus', menus);
router.use('/orders', orders);
router.use('/products', products);
router.use('/users', users);
router.use('/explorer', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc));

module.exports = router;
