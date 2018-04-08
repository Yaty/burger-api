const _ = require('lodash');
const {expect} = require('chai');
const config = require('../../src/config');
const OrderCRUD = require('../../src/controllers/Order');
const {api, buildUrl} = require('../utils');

const createOrder = async () => {
    const order = await OrderCRUD.create({
        price: 50,
    });

    return order.id;
};

// TODO : ACL
let adminToken;

describe('Order Integrations', () => {
    before((done) => {
        api.post(buildUrl('/users/login'))
            .send(config.admin)
            .end((err, res) => {
                if (err) return done(err);
                adminToken = res.body.id;
                done();
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
        let orderId;

        before(async () => {
            orderId = await createOrder();
        });

        it('should find data', (done) => {
            api.get(buildUrl('/orders'))
                .auth(adminToken, {type: 'bearer'})
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.not.be.empty;
                    expect(res.body).to.satisfy((arr) => !_.isNil(arr.find((m) => m.id === orderId)));
                    done();
                });
        });

        after(async () => {
            if (orderId) await OrderCRUD.destroyById(orderId);
        });
    });

    describe('Find by ID', () => {
        let orderId;

        before(async () => {
            orderId = await createOrder();
        });

        it('should find data by id', (done) => {
            api.get(buildUrl('/orders/' + orderId))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('should get 404', (done) => {
            api.get(buildUrl('/orders/100000'))
                .expect(404, done);
        });

        after(async () => {
            if (orderId) await OrderCRUD.destroyById(orderId);
        });
    });

    describe('Create', () => {
        let orderId;

        it('should create an instance', (done) => {
            const price = 50;

            api.post(buildUrl('/orders'))
                .auth(adminToken, {type: 'bearer'})
                .send({
                    price,
                })
                .expect(201)
                .end(async (err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.price).to.be.equal(price);
                    orderId = res.body.id;
                    done();
                });
        });

        after(async () => {
            if (orderId) await OrderCRUD.destroyById(orderId);
        });
    });

    describe('Update properties', () => {
        const data = {
            price: 50,
        };

        before(async () => {
            const {id} = await OrderCRUD.create(data);
            data.id = id;
        });

        const price = 60;

        it('should update an instance', (done) => {
            api.patch(buildUrl('/orders/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .send({
                    price,
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.price).to.be.equal(price);
                    done();
                });
        });

        after(async () => {
            if (data.id) await OrderCRUD.destroyById(data.id);
        });
    });

    describe('Update', () => {
        describe('Update properties', () => {
            const data = {
                price: 60,
            };

            before(async () => {
                const {id} = await OrderCRUD.create(data);
                data.id = id;
            });

            const price = 70;

            it('should update an instance', (done) => {
                api.put(buildUrl('/orders/' + data.id))
                    .auth(adminToken, {type: 'bearer'})
                    .send({
                        price,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id');
                        expect(res.body.price).to.be.equal(price);
                        done();
                    });
            });

            after(async () => {
                if (data.id) await OrderCRUD.destroyById(data.id);
            });
        });
    });

    describe('Delete', () => {
        const data = {
            price: 50,
        };

        before(async () => {
            const {id} = await OrderCRUD.create(data);
            data.id = id;
        });

        it('should delete', (done) => {
            api.delete(buildUrl('/orders/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(204, done);
        });

        it('should not delete and return 404', (done) => {
            api.delete(buildUrl('/orders/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(404, done);
        });

        after(async () => {
            if (data.id) await OrderCRUD.destroyById(data.id);
        });
    });

    describe('Exists', () => {
        const data = {
            price: 50,
        };

        before(async () => {
            const {id} = await OrderCRUD.create(data);
            data.id = id;
        });

        it('should exists', (done) => {
            api.head(buildUrl('/orders/' + data.id))
                .expect(200, done);
        });

        it('should not exists', (done) => {
            api.head(buildUrl('/orders/500000'))
                .expect(404, done);
        });

        after(async () => {
            if (data.id) await OrderCRUD.destroyById(data.id);
        });
    });

    describe('Count', () => {
        it('should return a counter', (done) => {
            api.get(buildUrl('/orders/count'))
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
