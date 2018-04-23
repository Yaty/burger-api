const config = require('../config').db;
const logger = require('../utils/logger')('database');
const migrate = require('./migrate');

const knex = require('knex')({
    client: 'mysql',
    connection: {
        user: config.user,
        password: config.password,
        database: config.database,
        host: config.host,
        port: config.port,
    },
    pool: {
        min: 0,
        max: 7,
    },
});

const db = module.exports = require('bookshelf')(knex);
db.plugin(require('bookshelf-uuid'));
db.plugin('visibility');

knex.raw('select 1+1 as result')
    .then(() => logger.info('Database connected.'))
    .then(() => migrate(db))
    .then(() => logger.info('Database migrated.'))
    .catch((err) => {
        logger.fatal('Error while connecting to the database.', {err});
        process.exit(1);
    });
