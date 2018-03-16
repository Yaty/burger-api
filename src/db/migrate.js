/**
 * This file is creating tables
 * It should only be called by hand
 */

const logger = require('../utils/logger')('migrate');

if (require.main !== module) { // https://nodejs.org/docs/latest/api/all.html#modules_accessing_the_main_module
    logger.fatal('You should not require this file.');
    process.exit(1);
}

const db = require('./index');

launchMigration()
    .then(() => {
        logger.info('Migration success !');
        process.exit(1);
    })
    .catch((err) => logger.error('Error while migrating.', {err}));

/**
 * Create users table
 */
async function launchMigration() {
    await createUsersTable();
    await createMenusTable();
}

/**
 * Create users table
 * @return {Promise.<*>}
 */
async function createUsersTable() {
    return db.knex.schema.createTableIfNotExists('users', function(t) {
        t.increments('id');
        t.string('first_name');
        t.string('last_name');
        t.string('password');
        t.timestamps();
    });
}

/**
 * Create menus table
 * @return {Promise.<*>}
 */
async function createMenusTable() {
    return db.knex.schema.createTableIfNotExists('menus', function(t) {
        t.increments('id');
        t.string('name');
        t.timestamps();
    });
}
