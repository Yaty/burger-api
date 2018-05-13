const _ = require('lodash');
const {expect} = require('chai');
const config = require('../../src/config');
const ProductCRUD = require('../../src/controllers/Product');
const {uuid, api, buildUrl} = require('../utils');

const createProduct = async () => {
    const product = await ProductCRUD.create({
        name: uuid(),
        price: 20,
    });

    return product.id;
};

// TODO : ACL
let adminToken;
let userToken;

describe('Product Integrations', () => {
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
        let productId;

        before(async () => {
            productId = await createProduct();
        });

        it('should find data', (done) => {
            api.get(buildUrl('/products'))
                .auth(adminToken, {type: 'bearer'})
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.not.be.empty;
                    expect(res.body).to.satisfy((arr) => !_.isNil(arr.find((m) => m.id === productId)));
                    done();
                });
        });

        after(async () => {
            if (productId) await ProductCRUD.destroyById(productId);
        });
    });

    describe('Find by ID', () => {
        let productId;

        before(async () => {
            productId = await createProduct();
        });

        it('should find data by id', (done) => {
            api.get(buildUrl('/products/' + productId))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('should get 404', (done) => {
            api.get(buildUrl('/products/100000'))
                .expect(404, done);
        });

        after(async () => {
            if (productId) await ProductCRUD.destroyById(productId);
        });
    });

    describe('Create', () => {
        let productId;

        it('should create an instance', (done) => {
            const name = uuid();
            const price = 50;

            api.post(buildUrl('/products'))
                .auth(adminToken, {type: 'bearer'})
                .send({
                    name,
                    price,
                })
                .expect(201)
                .end(async (err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.be.equal(name);
                    expect(res.body.price).to.be.equal(price);
                    productId = res.body.id;
                    done();
                });
        });

        after(async () => {
            if (productId) await ProductCRUD.destroyById(productId);
        });
    });

    describe('Update properties', () => {
        const data = {
            name: uuid(),
            price: 50,
        };

        before(async () => {
            const {id} = await ProductCRUD.create(data);
            data.id = id;
        });

        const name = uuid();
        const price = 20;

        it('should update an instance', (done) => {
            api.patch(buildUrl('/products/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .send({
                    name,
                    price,
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.be.equal(name);
                    expect(res.body.price).to.be.equal(price);
                    done();
                });
        });

        after(async () => {
            if (data.id) await ProductCRUD.destroyById(data.id);
        });
    });

    describe('Update', () => {
        describe('Update properties', () => {
            const data = {
                name: uuid(),
                price: 20,
            };

            before(async () => {
                const {id} = await ProductCRUD.create(data);
                data.id = id;
            });

            const name = uuid();
            const price = 25;

            it('should update an instance', (done) => {
                api.put(buildUrl('/products/' + data.id))
                    .auth(adminToken, {type: 'bearer'})
                    .send({
                        name,
                        price,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id');
                        expect(res.body.name).to.be.equal(name);
                        expect(res.body.price).to.be.equal(price);
                        done();
                    });
            });

            after(async () => {
                if (data.id) await ProductCRUD.destroyById(data.id);
            });
        });
    });

    describe('Delete', () => {
        const data = {
            name: uuid(),
            price: 5,
        };

        before(async () => {
            const {id} = await ProductCRUD.create(data);
            data.id = id;
        });

        it('should not be deleted by an user and return 401', (done) => {
            api.delete(buildUrl('/products/' + data.id))
                .auth(userToken, {type: 'bearer'})
                .expect(401, done);
        });

        it('should delete', (done) => {
            api.delete(buildUrl('/products/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(204, done);
        });

        it('should not delete and return 404', (done) => {
            api.delete(buildUrl('/products/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(404, done);
        });

        after(async () => {
            if (data.id) await ProductCRUD.destroyById(data.id);
        });
    });

    describe('Exists', () => {
        const data = {
            name: uuid(),
            price: 25,
        };

        before(async () => {
            const {id} = await ProductCRUD.create(data);
            data.id = id;
        });

        it('should exists', (done) => {
            api.head(buildUrl('/products/' + data.id))
                .expect(200, done);
        });

        it('should not exists', (done) => {
            api.head(buildUrl('/products/500000'))
                .expect(404, done);
        });

        after(async () => {
            if (data.id) await ProductCRUD.destroyById(data.id);
        });
    });

    describe('Count', () => {
        it('should return a counter', (done) => {
            api.get(buildUrl('/products/count'))
                .auth(adminToken, {type: 'bearer'})
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
