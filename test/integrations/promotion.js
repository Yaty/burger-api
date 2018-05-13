const _ = require('lodash');
const {expect} = require('chai');
const config = require('../../src/config');
const PromotionCRUD = require('../../src/controllers/Promotion');
const {api, buildUrl, uuid} = require('../utils');

const createPromotion = async (promotionIds = []) => {
    const promotion = await PromotionCRUD.create({
        value: 10,
        name: uuid(),
    });

    return promotion.id;
};

let adminToken;
// let userToken;

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

    /* before((done) => {
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
    }); */

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
                    expect(res.body).to.not.have.property('value');
                    expect(res.body).to.not.have.property('name');
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
});
