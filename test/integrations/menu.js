const _ = require('lodash');
const {expect} = require('chai');
const config = require('../../src/config');
const MenuCRUD = require('../../src/controllers/Menu');
const ProductCRUD = require('../../src/controllers/Product');
const PromotionCRUD = require('../../src/controllers/Promotion');
const {uuid, api, buildUrl} = require('../utils');

const createMenu = async (productIds = [], promotionIds = []) => {
    const menu = await MenuCRUD.create({
        name: uuid(),
        productIds,
        promotionIds,
    });

    return menu.id;
};

const createProduct = async () => {
    const product = await ProductCRUD.create({
        name: uuid(),
        price: uuid(),
    });

    return product.id;
};

const createPromotions = async () => {
    const promotion = await PromotionCRUD.create({
        value: 42,
        name: uuid(),
    });

    return promotion.id;
};

// TODO : ACL
let adminToken;
let userToken;

describe('Menu Integrations', () => {
    before((done) => {
        api.post(buildUrl('/users/login'))
            .send(config.admin)
            .end((err, res) => {
                if (err) return done(err);
                adminToken = res.body.id;
                done();
            });
    });

    before((done) => {
        const user = {
            email: uuid() + '@' + uuid() + '.fr',
            password: uuid(),
        };
        api.post(buildUrl('/users'))
            .send(user)
            .end((err, res) => {
                if (err) return done(err);
                api.post(buildUrl('/users/login'))
                    .send(user)
                    .end((err, res) => {
                        if (err) return done(err);
                        userToken = res.body.id;
                        done();
                    });
            });
    });

    after((done) => {
        api.post(buildUrl('/users/logout'))
            .auth(adminToken, {type: 'bearer'})
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    describe('Find', () => {
        let menuId;

        before(async () => {
            menuId = await createMenu();
        });

        it('should find menus', (done) => {
            api.get(buildUrl('/menus'))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.not.be.empty;
                    expect(res.body).to.satisfy((arr) => !_.isNil(arr.find((m) => m.id === menuId)));
                    done();
                });
        });

        after(async () => {
            if (menuId) await MenuCRUD.destroyById(menuId);
        });
    });

    describe('Find by ID', () => {
        let menuId;
        let productId;
        let promotionId;

        before(async () => {
            productId = await createProduct();
            promotionId = await createPromotions();
            menuId = await createMenu([productId], [promotionId]);
        });

        it('should find data by id', (done) => {
            api.get(buildUrl('/menus/' + menuId))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('products');
                    done();
                });
        });

        it('should retrieve products inside a menu with a query', (done) => {
            api.get(buildUrl('/menus/' + menuId + '?include=products'))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('products');
                    expect(res.body.products).to.be.an('array');
                    expect(res.body.products[0].id).to.be.equal(productId);
                    done();
                });
        });

        it('should retrieve products inside a menu with a route', (done) => {
            api.get(buildUrl('/menus/' + menuId + '/products'))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0].id).to.be.equal(productId);
                    done();
                });
        });

        it('should retrieve promotions inside a menu with a query', (done) => {
            api.get(buildUrl('/menus/' + menuId + '?include=promotions'))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('promotions');
                    expect(res.body.promotions).to.be.an('array');
                    expect(res.body.promotions[0].id).to.be.equal(promotionId);
                    done();
                });
        });

        it('should retrieve promotions inside a menu with a route', (done) => {
            api.get(buildUrl('/menus/' + menuId + '/promotions'))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0].id).to.be.equal(promotionId);
                    done();
                });
        });

        it('should get 404', (done) => {
            api.get(buildUrl('/menus/100000'))
                .expect(404, done);
        });

        after(async () => {
            await ProductCRUD.destroyById(productId);
            await MenuCRUD.destroyById(menuId);
        });
    });

    describe('Create', () => {
        let menuId;

        it('should create an instance', (done) => {
            const name = uuid();

            api.post(buildUrl('/menus'))
                .auth(adminToken, {type: 'bearer'})
                .send({
                    name,
                })
                .expect(201)
                .end(async (err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.be.equal(name);
                    menuId = res.body.id;
                    done();
                });
        });

        it('should create an instance with products', (done) => {
            const name = uuid();
            createProduct()
                .then((productId) => {
                    api.post(buildUrl('/menus'))
                        .auth(adminToken, {type: 'bearer'})
                        .send({
                            name,
                            productIds: [productId],
                        })
                        .expect(201)
                        .end((err, res) => {
                            if (err) return done(err);
                            expect(res.body).to.be.an('object');
                            expect(res.body).to.have.property('id');
                            expect(res.body.name).to.be.equal(name);
                            menuId = res.body.id;
                            api.get(buildUrl('/menus/' + menuId + '/products'))
                                .expect(200)
                                .end((err, res) => {
                                    if (err) return done(err);
                                    expect(res.body).to.be.an('array');
                                    expect(res.body[0].id).to.be.equal(productId);
                                    done();
                                });
                        });
                })
                .catch(done);
        });

        afterEach(async () => {
            if (menuId) {
                await MenuCRUD.destroyById(menuId);
                menuId = null;
            }
        });
    });

    describe('Update properties', () => {
        const data = {
            name: uuid(),
        };

        before(async () => {
            const {id} = await MenuCRUD.create(data);
            data.id = id;
        });

        const name = uuid();

        it('should update an instance', (done) => {
            api.patch(buildUrl('/menus/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .send({
                    name,
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.be.equal(name);
                    done();
                });
        });

        after(async () => {
            if (data.id) await MenuCRUD.destroyById(data.id);
        });
    });

    describe('Update', () => {
        describe('Update properties', () => {
            const data = {
                name: uuid(),
            };

            before(async () => {
                const {id} = await MenuCRUD.create(data);
                data.id = id;
            });

            const name = uuid();

            it('should update an instance', (done) => {
                api.put(buildUrl('/menus/' + data.id))
                    .auth(adminToken, {type: 'bearer'})
                    .send({
                        name,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id');
                        expect(res.body.name).to.be.equal(name);
                        done();
                    });
            });

            after(async () => {
                if (data.id) await MenuCRUD.destroyById(data.id);
            });
        });
    });

    describe('Delete', () => {
        const data = {
            name: uuid(),
        };

        before(async () => {
            const {id} = await MenuCRUD.create(data);
            data.id = id;
        });

        it('should not be deleted by an user and return 401', (done) => {
            api.delete(buildUrl('/menus/' + data.id))
                .auth(userToken, {type: 'bearer'})
                .expect(401, done);
        });

        it('should delete', (done) => {
            api.delete(buildUrl('/menus/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(204, done);
        });

        it('should not delete and return 404', (done) => {
            api.delete(buildUrl('/menus/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(404, done);
        });

        after(async () => {
            if (data.id) await MenuCRUD.destroyById(data.id);
        });
    });

    describe('Exists', () => {
        const data = {
            name: uuid(),
        };

        before(async () => {
            const {id} = await MenuCRUD.create(data);
            data.id = id;
        });

        it('should exists', (done) => {
            api.head(buildUrl('/menus/' + data.id))
                .expect(200, done);
        });

        it('should not exists', (done) => {
            api.head(buildUrl('/menus/500000'))
                .expect(404, done);
        });

        after(async () => {
            if (data.id) await MenuCRUD.destroyById(data.id);
        });
    });

    describe('Count', () => {
        it('should return a counter', (done) => {
            api.get(buildUrl('/menus/count'))
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body.count).to.be.finite;
                    expect(res.body.count).to.be.above(-1);
                    done();
                });
        });
    });
});
