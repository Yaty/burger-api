const _ = require('lodash');
const {expect} = require('chai');
const config = require('../../src/config');
const UserCRUD = require('../../src/controllers/User');
const {uuid, api, buildUrl} = require('../utils');

const createUser = async () => {
    const user = await UserCRUD.create({
        email: uuid() + '@qsdqsdqd.fr',
        password: uuid(),
    });

    return user.id;
};

// TODO : ACL
let adminToken;

describe('User Integrations', () => {
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
        let userId;

        before(async () => {
            userId = await createUser();
        });

        it('should find data', (done) => {
            api.get(buildUrl('/users'))
                .auth(adminToken, {type: 'bearer'})
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('array');
                    expect(res.body).to.not.be.empty;
                    expect(res.body).to.satisfy((arr) => !_.isNil(arr.find((m) => m.id === userId)));
                    done();
                });
        });

        after(async () => {
            if (userId) await UserCRUD.destroyById(userId);
        });
    });

    describe('Find by ID', () => {
        let userId;

        before(async () => {
            userId = await createUser();
        });

        it('should find data by id', (done) => {
            api.get(buildUrl('/users/' + userId))
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    done();
                });
        });

        it('should get 404', (done) => {
            api.get(buildUrl('/users/100000'))
                .expect(404, done);
        });

        after(async () => {
            if (userId) await UserCRUD.destroyById(userId);
        });
    });

    describe('Create', () => {
        let userId;

        it('should create an instance', (done) => {
            const email = uuid() + '@dfsdfs.fr';
            const password = uuid();

            api.post(buildUrl('/users'))
                .auth(adminToken, {type: 'bearer'})
                .send({
                    email,
                    password,
                })
                .expect(201)
                .end(async (err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.email).to.be.equal(email);
                    expect(res.body).to.not.have.property('password');
                    userId = res.body.id;
                    done();
                });
        });

        after(async () => {
            if (userId) await UserCRUD.destroyById(userId);
        });
    });

    describe('Update properties', () => {
        const data = {
            email: uuid() + '@dfsdfsdf.fr',
            password: uuid(),
        };

        before(async () => {
            const {id} = await UserCRUD.create(data);
            data.id = id;
        });

        const email = uuid() + '@dfsdfs.fr';
        const password = uuid();

        it('should update an instance', (done) => {
            api.patch(buildUrl('/users/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .send({
                    email,
                    password,
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('id');
                    expect(res.body.email).to.be.equal(email);
                    expect(res.body).to.not.have.property('password');
                    done();
                });
        });

        after(async () => {
            if (data.id) await UserCRUD.destroyById(data.id);
        });
    });

    describe('Update', () => {
        describe('Update properties', () => {
            const data = {
                email: uuid() + '@fsdfsdf.fr',
                password: uuid(),
            };

            before(async () => {
                const {id} = await UserCRUD.create(data);
                data.id = id;
            });

            const email = uuid() + '@dfsdfs.fr';
            const password = uuid();

            it('should update an instance', (done) => {
                api.put(buildUrl('/users/' + data.id))
                    .auth(adminToken, {type: 'bearer'})
                    .send({
                        email,
                        password,
                    })
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('id');
                        expect(res.body.email).to.be.equal(email);
                        expect(res.body).to.not.have.property('password');
                        done();
                    });
            });

            after(async () => {
                if (data.id) await UserCRUD.destroyById(data.id);
            });
        });
    });

    describe('Delete', () => {
        const data = {
            email: uuid() + '@fsdfsd.fr',
            password: uuid(),
        };

        before(async () => {
            const {id} = await UserCRUD.create(data);
            data.id = id;
        });

        it('should delete', (done) => {
            api.delete(buildUrl('/users/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(204, done);
        });

        it('should not delete and return 404', (done) => {
            api.delete(buildUrl('/users/' + data.id))
                .auth(adminToken, {type: 'bearer'})
                .expect(404, done);
        });

        after(async () => {
            if (data.id) await UserCRUD.destroyById(data.id);
        });
    });

    describe('Exists', () => {
        const data = {
            email: uuid() + '@qfsdfs.fr',
            password: uuid(),
        };

        before(async () => {
            const {id} = await UserCRUD.create(data);
            data.id = id;
        });

        it('should exists', (done) => {
            api.head(buildUrl('/users/' + data.id))
                .expect(200, done);
        });

        it('should not exists', (done) => {
            api.head(buildUrl('/users/500000'))
                .expect(404, done);
        });

        after(async () => {
            if (data.id) await UserCRUD.destroyById(data.id);
        });
    });

    describe('Count', () => {
        it('should return a counter', (done) => {
            api.get(buildUrl('/users/count'))
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

    describe('Login', () => {
        const data = {
            email: uuid() + '@qfsdfs.fr',
            password: uuid(),
        };

        before(async () => {
            const {id} = await UserCRUD.create(JSON.parse(JSON.stringify(data)));
            data.id = id;
        });

        it('should login', (done) => {
            api.post(buildUrl('/users/login'))
                .send({
                    email: data.email,
                    password: data.password,
                })
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.body).to.have.property('id');
                    expect(res.body).to.have.property('created_at');
                    expect(res.body).to.have.property('ttl');
                    expect(res.body).to.have.property('userId').to.be.equal(data.id);
                    done();
                });
        });
    });

    describe('Logout', () => {
        const data = {
            email: uuid() + '@qfsdfs.fr',
            password: uuid(),
        };

        let token;

        before((done) => {
            UserCRUD.create(JSON.parse(JSON.stringify(data)))
                .then(() => {
                    api.post(buildUrl('/users/login'))
                        .send({
                            email: data.email,
                            password: data.password,
                        })
                        .expect(200)
                        .end((err, res) => {
                            if (err) return done(err);
                            token = res.body.id;
                            done();
                        });
                });
        });

       it('should logout', (done) => {
           api.post(buildUrl('/users/logout'))
               .auth(token, {type: 'bearer'})
               .expect(204)
               .end((err) => {
                   if (err) return done(err);
                   done();
               });
       });
    });
});
