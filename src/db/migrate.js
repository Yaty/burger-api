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
 * Create tables
 */
async function launchMigration() {
	await createUsersTable();
	await createProductsTable();
	await createMenusTable();
	await createProducts_MenusTable();
	await createOrdersTable();
	await createProductsMenus_OrdersTable();
	await createPromotionsTable();
}

/**
 * Create users table
 * @return {Promise.<*>}
 */
async function createUsersTable() {
    return db.knex.schema.createTableIfNotExists('users', function(t) {
        t.increments('id');
        t.string('first_name').defaultTo('Mr.');
	t.string('last_name').defaultTo('Meeseeks');
	t.string('email');
	t.string('password').notNullable();
	t.integer('reduceToken').unsigned();
        t.timestamps();
    });
}

/**
 * Create products table
 * @return {Promise.<*>}
 */
async function createProductsTable() {
    return db.knex.schema.createTableIfNotExists('products', function(t) {
        t.increments('id').unique().unsigned();
        t.string('name').unique();
	t.integer('price').unsigned();
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
        t.string('name').unique();
	t.integer('price').unsigned();
    	t.timestamps();
	});
}

/**
 * Create orders products-menus (associative)
 * @return {Promise.<*>}
 */
async function createProducts_MenusTable() {
    return db.knex.schema.createTableIfNotExists('products-menus', function(t) {
        t.increments('id');
    	t.timestamps();
	});
}

/**
 * Create orders table
 * @return {Promise.<*>}
 */
async function createOrdersTable() {
    return db.knex.schema.createTableIfNotExists('orders', function(t) {
        t.increments('id');
	t.dateTime('date');
    	t.timestamps();
	});
}

/**
 * Create orders products_menus-orders (associative)
 * @return {Promise.<*>}
 */
async function createProductsMenus_OrdersTable() {
    return db.knex.schema.createTableIfNotExists('products_menus-orders', function(t) {
        t.increments('id');
    	t.timestamps();
	});
}

/**
 * Create promotions table
 * @return {Promise.<*>}
 */
async function createPromotionsTable() {
    return db.knex.schema.createTableIfNotExists('promotions', function(t) {
        t.increments('id');
	t.string('name');
	t.dateTime('dateBegin');
	t.dateTime('dateEnd');
	t.integer('reduction_percentage').unsigned();
    	t.timestamps();
	});
}
