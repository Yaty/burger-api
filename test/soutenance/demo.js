/*
1. Connect as admin
2. Create products
3. Create menus
4. Logout

5. Create account
6. Login
7. Make orders
8. Logout

9. Make orders while being unauthenticated
 */

const {api, buildUrl, uuid} = require('../utils');
const logger = require('../../src/utils/logger')('SOUTENANCE');

/**
 * Log
 * @param {String} msg
 * @param {Object} res
 * @param {Object} args
 */
function log(msg, res, ...args) {
    logger.warn(msg, {body: res.body, statusCode: res.statusCode, errors: JSON.stringify(res.body.error && res.body.error.errors || {}), args});
}

/**
 * Login
 * @param {String} email
 * @param {String} password
 * @return {Promise}
 */
async function login(email, password) {
    return new Promise((resolve, reject) => {
        api.post(buildUrl('/users/login'))
            .send({
                email,
                password,
            })
            .expect(200)
            .end((err, res) => {
                if (err) return reject(err);
                log('Login', res, {email, password});
                return resolve(res.body.id);
            });
    });
}

/**
 * Logout
 * @param {String} token
 * @return {Promise}
 */
async function logout(token) {
    return new Promise((resolve, reject) => {
        api.post(buildUrl('/users/logout'))
            .auth(token, {type: 'bearer'})
            .expect(204)
            .end((err, res) => {
                if (err) return reject(err);
                log('Logout', res, {token});
                return resolve();
            });
    });
}

/**
 * Create product
 * @param {String} token
 * @return {Promise}
 */
async function createProduct(token) {
    return new Promise((resolve, reject) => {
        api.post(buildUrl('/products'))
            .auth(token, {type: 'bearer'})
            .send({
                name: uuid(),
                price: uuid(),
            })
            .expect(201)
            .end((err, res) => {
                if (err) return reject(err);
                log('createProduct', res);
                return resolve(res.body.id);
            });
    });
}

/**
 * Create menu
 * @param {Array<Number>} productIds
 * @param {String} token
 * @return {Promise}
 */
async function createMenu(productIds, token) {
    return new Promise((resolve, reject) => {
        api.post(buildUrl('/menus'))
            .auth(token, {type: 'bearer'})
            .send({
                name: uuid(),
                productIds,
            })
            .expect(201)
            .end((err, res) => {
                if (err) return reject(err);
                log('createMenu', res);
                resolve(res.body.id);
            });
    });
}

/**
 * Create products
 * @param {Number} nb
 * @param {String} token
 * @return {Promise.<*[]>}
 */
function createProducts(nb = 2, token) {
    const p = [];
    for (let i = 0; i < nb; i++) p.push(createProduct(token));
    return Promise.all(p);
}

describe('Soutenance', () => {
    let adminToken;

    before(async () => {
        adminToken = await login(process.env.ADMIN_EMAIL, process.env.ADMIN_PASSWORD);
    });

    it('should create product', async () => {
        await createProduct(adminToken);
    });

    it('should not create a product if not an admin', async () => {
        try {
            await createProduct();
        } catch (err) {
            if (!err.message.includes('401')) throw err;
        }
    });

    it('should list products', (done) => {
        api.get(buildUrl('/products'))
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                log('should list products', res);
                done();
            });
    });

    it('should get product by id', (done) => {
        createProduct(adminToken)
            .then((productId) => {
                api.get(buildUrl('/products/' + productId))
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        log('should get product by id', res);
                        done();
                    });
            })
            .catch(done);
    });

    it('should not found product', (done) => {
        api.get(buildUrl('/products/999999999999999'))
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                log('should not found product', res);
                done();
            });
    });

    it('should create a menu and attach a product', (done) => {
        createProducts(5, adminToken)
            .then((productIds) => createMenu(productIds, adminToken))
            .then(() => done())
            .catch(done);
    });

    it('should get a menu with products', (done) => {
        createProducts(5, adminToken)
            .then((productIds) => createMenu(productIds, adminToken))
            .then((menuId) => {
                api.get(buildUrl('/menus/' + menuId + '?include=products'))
                    .auth(adminToken, {type: 'bearer'})
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        log('should get a menu with products', res, {products: JSON.stringify(res.body.products)});
                        done();
                    });
            })
            .catch(done);
    });

    it('should make an order of several menus and products', (done) => {
        createProducts(5, adminToken)
            .then((productIds) => createMenu(productIds, adminToken))
            .then(async (menuId) => {
                api.post(buildUrl('/orders'))
                    .send({
                        menuIds: [menuId],
                        productIds: await createProducts(3, adminToken),
                    })
                    .expect(201)
                    .end((err, res) => {
                        if (err) return done(err);
                        log('should make an order of several menus and products', res, {products: JSON.stringify(res.body.products)});
                        done();
                    });
            })
            .catch(done);
    });

    after(async () => {
        await logout(adminToken);
    });
});
