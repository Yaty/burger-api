const app = require('../src/app');
const supertest = require('supertest');
const api = supertest(app);
const BASE_URL = '/v' + require('../package.json').version.split('.')[0];



module.exports = {
    api,
    uuid() {
        return String(Math.floor(Math.random() * 1000000));
    },
    buildUrl(url) {
        return BASE_URL + url;
    },
    login(credentials) {
        return new Promise(((resolve, reject) => {
            api.post(module.exports.buildUrl('/users/login'))
                .send(credentials)
                .end((err, res) => {
                    if (err) return reject(err);
                    resolve(res.body.id);
                });
        }));
    }};

