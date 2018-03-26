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
    await createProductsMenusTable();
    await createOrdersTable();
    await createProductsMenusOrdersTable();
    await createPromotionsTable();
}

/**
 * Create users table
 * Champ who can be ad for connected user:
 * t.string('first_name').defaultTo('Mr.');
 * t.string('last_name').defaultTo('Meeseeks');
 * t.string('email');
 * t.string('password').notNullable();
 * t.integer('reduceToken').unsigned();
 * @return {Promise.<*>}
 */
async function createUsersTable() {
    return db.knex.schema.createTableIfNotExists('users', function(t) {
        t.increments('id').unique().unsigned().primary();
        t.foreign('idProductsMenus_Orders')
            .references('products_menus-orders.ids');
        t.timestamps();
    });
}

/**
 * Create products table
 * @return {Promise.<*>}
 */
async function createProductsTable() {
    return db.knex.schema.createTableIfNotExists('products', function(t) {
        t.increments('id').unique().unsigned().primary();
        t.string('name').unique().notNullable();
        t.integer('price').unsigned();
        t.foreign('idProductsMenus').references('products-menus.ids');
        t.timestamps();
    });
}

/**
 * Create menus table
 * @return {Promise.<*>}
 */
async function createMenusTable() {
    return db.knex.schema.createTableIfNotExists('menus', function(t) {
        t.increments('id').unique().unsigned().primary();
        t.string('name').unique();
        t.integer('price').unsigned();
        t.foreign('idProductsMenus').references('products-menus.ids');
        t.timestamps();
    });
}

/**
 * Create orders products-menus (associative)
 * @return {Promise.<*>}
 */
async function createProductsMenusTable() {
    return db.knex.schema.createTableIfNotExists('products-menus', function(t) {
        t.increments('id').unique().unsigned().primary();
        t.foreign('idMenu').references('menus.id');
        t.foreign('idProduct').references('products.id');
        t.foreign('idProductsMenus_Orders')
            .references('products_menus-orders.id');
        t.foreign('idPromotions').references('promotions.id');
        t.timestamps();
    });
}

/**
 * Create orders table
 * @return {Promise.<*>}
 */
async function createOrdersTable() {
    return db.knex.schema.createTableIfNotExists('orders', function(t) {
        t.increments('id').unique().unsigned().primary();
        t.foreign('idProductsMenus_Orders')
            .references('products_menus-orders.ids');
        t.foreign('idUsers').references('users.id');
        t.dateTime('date');
        t.timestamps();
    });
}

/**
 * Create orders products_menus-orders (associative)
 * @return {Promise.<*>}
 */
async function createProductsMenusOrdersTable() {
    return db.knex.schema
    .createTableIfNotExists('products_menus-orders', function(t) {
        t.foreign('idMenusProducts').references('products-menus.ids');
        t.foreign('idOrders').references('orders.id');
        t.foreign('idPromotions').references('promotions.id');
        t.increments('id').unique().unsigned().primary();
        t.timestamps();
    });
}

/**
 * Create promotions table
 * @return {Promise.<*>}
 */
async function createPromotionsTable() {
    return db.knex.schema.createTableIfNotExists('promotions', function(t) {
        t.increments('id').unique().unsigned().primary();
        t.string('name');
        t.dateTime('dateBegin');
        t.dateTime('dateEnd');
        t.integer('reductionPercentage').unsigned();
        t.foreign('idMenusProducts').references('products-menus.ids');
        t.foreign('idProductsMenus_Orders')
            .references('products_menus-orders.ids');
        t.timestamps();
    });
}
