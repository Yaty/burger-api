const _ = require('lodash');
const {expect} = require('chai');
const config = require('../../src/config');
const PromotionCRUD = require('../../src/controllers/Promotion');
const {api, buildUrl, uuid} = require('../utils');

const createPromotion = async () => {
    const promotion = await PromotionCRUD.create({
        value: 10,
        name: uuid(),
    });

    return promotion.id;
};

let adminToken;
let userToken;

describe('Promotion Integrations', () => {
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
        let promoId;

        before(async () => {
            promoId = await createPromotion();
        });

        it('should find promotions', (done) => {
            api.get(buildUrl('/promotions'))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.satisfy((arr) => !_.isNil(arr.find((m) => m.id === promoId)));
                    done();
                });
        });

        after(async () => {
            if (promoId) await PromotionCRUD.destroyById(promoId);
        });
    });

    describe('Find by ID', () => {
        let promotionId;

        before(async () => {
            promotionId = await createPromotion();
        });

        it('should find data by id', (done) => {
            api.get(buildUrl('/promotions/' + promotionId))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.not.have.property('name');
                    expect(res.body).to.not.have.property('value');
                    done();
                });
        });

        it('should get 404', (done) => {
            api.get(buildUrl('/promotions/100000'))
                .expect(404, done);
        });

        after(async () => {
            await PromotionCRUD.destroyById(promotionId);
        });
    });

    describe('Create', () => {
        let promotionId;

        it('should create an instance', (done) => {
            const name = uuid();
            const value = 10;

            api.post(buildUrl('/promotions'))
                .auth(adminToken, {type: 'bearer'})
                .send({
                    name,
                    value,
                })
                .expect(201)
                .end(async (err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.be.equal(name);
                    expect(res.body.value).to.be.equal(value);
                    promotionId = res.body.id;
                    done();
                });
        });

        afterEach(async () => {
            if (promotionId) {
                await PromotionCRUD.destroyById(promotionId);
                promotionId = null;
            }
        });
    });

    describe('Update properties', () => {
        const data = {
            name: uuid(),
            value: 10,
        };

        before(async () => {
            const {id} = await PromotionCRUD.create(data);
            data.id = id;
        });

        const name = uuid();
        const value = 90;

        it('should update an instance', (done) => {
            api.patch(buildUrl('/promotions/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .send({
                    name,
                    value,
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.be.equal(name);
                    expect(res.body.value).to.be.equal(value);
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
                value: 1.1,
            };

            before(async () => {
                const {id} = await PromotionCRUD.create(data);
                data.id = id;
            });

            const name = uuid();
            const value = 42.0;

            it('should update an instance', (done) => {
                api.put(buildUrl('/promotions/' + data.id))
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
                        expect(res.body.value).to.be.equal(value);
                        done();
                    });
            });

            after(async () => {
                if (data.id) await PromotionCRUD.destroyById(data.id);
            });
        });
    });

    describe('Delete', () => {
        const data = {
            name: uuid(),
            value: 0.1,
        };

        before(async () => {
            const {id} = await PromotionCRUD.create(data);
            data.id = id;
        });

        it('should not be deleted by an user and return 401', (done) => {
            api.delete(buildUrl('/promotions/' + data.id))
                .auth(userToken, {type: 'bearer'})
                .expect(401, done);
        });

        it('should delete', (done) => {
            api.delete(buildUrl('/promotions/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(204, done);
        });

        it('should not delete and return 404', (done) => {
            api.delete(buildUrl('/promotions/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(404, done);
        });

        after(async () => {
            if (data.id) await PromotionCRUD.destroyById(data.id);
        });
    });
});
