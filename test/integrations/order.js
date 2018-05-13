const _ = require('lodash');
const {expect} = require('chai');
const config = require('../../src/config');
const OrderCRUD = require('../../src/controllers/Order');
const {api, buildUrl, uuid} = require('../utils');

const createOrder = async (userId) => {
    const order = await OrderCRUD.create({
        price: 50,
        userId,
    });

    return order.id;
};

const createUser = async () => {
    const user = await UserCRUD.create({
        email: uuid() + '@qsdqsdqd.fr',
        password: uuid(),
    });

    return user.id;
};

// TODO : ACL
let adminToken;
let userId;
let userToken;

describe('Order Integrations', () => {
    before((done) => {
        api.post(buildUrl('/users/login'))
            .send(config.admin)
            .end((err, res) => {
                if (err) return done(err);
                adminToken = res.body.id;

                const email = uuid() + '@' + uuid() + '.fr';
                const password = uuid();

                api.post(buildUrl('/users'))
                    .send({
                        email,
                        password,
                    })
                    .end((err, res) => {
                        if (err) return done(err);
                        userId = res.body.id;
                        api.post(buildUrl('/users/login'))
                            .send({
                                email,
                                password,
                            })
                            .end((err, res) => {
                                if (err) return done(err);
                                userToken = res.body.id;
                                done();
                            });
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
            orderId = await createOrder(userId);
        });

        it('should find data by id', (done) => {
            api.get(buildUrl('/orders/' + orderId))
                .auth(userToken, {type: 'bearer'})
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('should get 401', (done) => {
            api.get(buildUrl('/orders/100000'))
                .expect(401, done);
        });

        after(async () => {
            if (orderId) await OrderCRUD.destroyById(orderId);
        });
    });

    describe('Create', () => {
        let orderId;

        it('should create an instance', (done) => {
            api.post(buildUrl('/orders'))
                .auth(adminToken, {type: 'bearer'})
                .expect(201)
                .end(async (err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.price).to.be.equal(0);
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

        it('should update an instance', (done) => {
            api.patch(buildUrl('/orders/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.price).to.be.equal(0);
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

            it('should update an instance', (done) => {
                api.put(buildUrl('/orders/' + data.id))
                    .auth(adminToken, {type: 'bearer'})
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id');
                        expect(res.body.price).to.be.equal(0);
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
        let otherUser;

        before(async () => {
            const {id} = await OrderCRUD.create(data);
            data.id = id;
        });

        before(async () => {
            otherUser = await createUser();
        });

        it('should not delete', (done) => {
            api.delete(buildUrl('/orders/' + data.id))
                .auth(otherUser, {type: 'bearer'})
                .expect(401, done);
        });

        it('should delete', (done) => {
            api.delete(buildUrl('/orders/' + data.id))
                .auth(userToken, {type: 'bearer'})
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
                .auth(adminToken, {type: 'bearer'})
                .expect(200, done);
        });

        it('should not exists', (done) => {
            api.head(buildUrl('/orders/500000'))
                .expect(401, done);
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
