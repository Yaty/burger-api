const Model = require('../../src/models/Menu');
const crud = require('../../src/controllers/crud')(Model);
const app = require('../../src/app');
const {expect} = require('chai');
const supertest = require('supertest');
const api = supertest(app);
const BASE_URL = '/v' + require('../../package.json').version.split('.')[0];

const buildUrl = (url) => BASE_URL + url;

describe('CRUD Integrations', () => {
    describe('Find', () => {
        it('should find data', (done) => {
            api.get(buildUrl('/menus'))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    done();
                });
        });
    });

    describe('Find by ID', () => {
        const data = {
            name: 'integrationTest',
        };

        before(async () => {
            const {id} = await crud.create(data);
            data.id = id;
        });

        it('should find data by id', (done) => {
            api.get(buildUrl('/menus/' + data.id))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('should get 404', (done) => {
            api.get(buildUrl('/menus/100000'))
                .expect(404, done);
        });

        after(async () => {
            await crud.destroyById(data.id);
        });
    });

    describe('Create', () => {
        it('should create an instance', (done) => {
            api.post(buildUrl('/menus'))
                .send({
                    name: 'testCreate',
                })
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.be.equal('testCreate');
                    done();
                });
        });
    });

    describe('Update properties', () => {
        const data = {
            name: 'updateProp',
        };

        before(async () => {
            const {id} = await crud.create(data);
            data.id = id;
        });

        it('should update an instance', (done) => {
            api.patch(buildUrl('/menus/' + data.id))
                .send({
                    name: 'testUpdate',
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.name).to.be.equal('testUpdate');
                    done();
                });
        });

        after(async () => {
            await crud.destroyById(data.id);
        });
    });

    describe('Update', () => {
        describe('Update properties', () => {
            const data = {
                name: 'updateProp',
            };

            before(async () => {
                const {id} = await crud.create(data);
                data.id = id;
            });

            it('should update an instance', (done) => {
                api.put(buildUrl('/menus/' + data.id))
                    .send({
                        name: 'testUpdate',
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id');
                        expect(res.body.name).to.be.equal('testUpdate');
                        done();
                    });
            });

            after(async () => {
                await crud.destroyById(data.id);
            });
        });
    });

    describe('Delete', () => {
        const data = {
            name: 'willBeDeleted',
        };

        before(async () => {
            const {id} = await crud.create(data);
            data.id = id;
        });

        it('should delete', (done) => {
            api.delete(buildUrl('/menus/' + data.id))
                .expect(204, done);
        });

        it('should not delete and return 204', (done) => {
            api.delete(buildUrl('/menus/' + data.id))
                .expect(204, done);
        });
    });

    describe('Exists', () => {
        const data = {
            name: 'exists',
        };

        before(async () => {
            const {id} = await crud.create(data);
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
            await crud.destroyById(data.id);
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
                    expect(res.body.count).to.be.above(0);
                    done();
                });
        });
    });
});
