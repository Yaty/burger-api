/**
 * This file is creating tables
 * It should only be called by hand
 */

module.exports = async function(db) {
    const createTable = async (t, cb) => {
        if (await db.knex.schema.hasTable(t)) return;
        return await db.knex.schema.createTable(t, cb);
    };

    // Main tables
    await createUserTable();
    await createProductTable();
    await createMenuTable();
    await createOrderTable();
    await createRoleTable();
    await createAccessTokenTable();

    // Liaison tables
    await createProductMenuTable();
    await createOrderProductTable();
    await createOrderMenuTable();
    await createRoleMappingTable();

    // TODO : init application data (create roles (admin, ...), then create admin)

    /**
     * Create users table
     * @return {Promise<*>}
     */
    async function createUserTable() {
        return await createTable('User', (t) => {
            t.increments('id').primary();
            t.string('firstName');
            t.string('lastName');
            t.string('email').unique().notNullable();
            t.string('password').notNullable();
            t.timestamps();
        });
    }

    /**
     * Create products table
     * @return {Promise.<*>}
     */
    async function createProductTable() {
        return await createTable('Product', (t) => {
            t.increments('id').primary();
            t.string('name').unique().notNullable();
            t.integer('price').unsigned().notNullable();
            t.timestamps();
        });
    }

    /**
     * Create menus table
     * @return {Promise.<*>}
     */
    async function createMenuTable() {
        return await createTable('Menu', (t) => {
            t.increments('id').primary();
            t.string('name').unique().notNullable();
            t.integer('price').unsigned().notNullable();
            t.timestamps();
        });
    }

    /**
     * Create orders table
     * @return {Promise.<*>}
     */
    async function createOrderTable() {
        return await createTable('Order', (t) => {
            t.increments('id').primary();
            t.integer('price').unsigned().notNullable();
            t.integer('userId').unsigned().references('User.id');
            t.timestamps();
        });
    }

    /**
     * Create role table
     * @return {Promise.<*>}
     */
    async function createRoleTable() {
        return await createTable('Role', (t) => {
            t.increments('id').primary();
            t.string('name').unique().notNullable();
            t.timestamps();
        });
    }

    /**
     * Create AccessToken table
     * @return {Promise.<*>}
     */
    async function createAccessTokenTable() {
        return await createTable('AccessToken', (t) => {
            t.uuid('id').primary();
            t.integer('ttl').unsigned();
            t.integer('userId').unsigned().references('User.id');
            t.timestamps();
        });
    }

    /**
     * Create ProductMenu table
     * @return {Promise.<*>}
     */
    async function createProductMenuTable() {
        return await createTable('ProductMenu', (t) => {
            t.integer('productId').unsigned().references('Product.id');
            t.integer('menuId').unsigned().references('Menu.id');
            t.timestamps();
        });
    }

    /**
     * Create OrderProduct table
     * @return {Promise.<*>}
     */
    async function createOrderProductTable() {
        return await createTable('OrderProduct', (t) => {
            t.integer('orderId').unsigned().references('Order.id');
            t.integer('productId').unsigned().references('Product.id');
            t.timestamps();
        });
    }

    /**
     * Create Order Menu table
     * @return {Promise.<*>}
     */
    async function createOrderMenuTable() {
        return await createTable('OrderMenu', (t) => {
            t.integer('orderId').unsigned().references('Order.id');
            t.integer('menuId').unsigned().references('Menu.id');
            t.timestamps();
        });
    }

    /**
     * Create RoleMapping tale
     * @return {Promise.<*>}
     */
    async function createRoleMappingTable() {
        return await createTable('RoleMapping', (t) => {
            t.integer('roleId').unsigned().references('Role.id');
            t.integer('userId').unsigned().references('User.id');
            t.timestamps();
        });
    }
};
