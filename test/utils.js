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
};

