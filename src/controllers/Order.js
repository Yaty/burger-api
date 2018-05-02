const _ = require('lodash');
const {Order} = require('../models');
const crud = require('./utils/crud')(Order);
const Product = require('./Product');
const Menu = require('./Menu');

/**
 * Eval order price
 * @param {Array} productIds
 * @param {Array} menuIds
 * @return {Promise.<number>}
 */
async function evalPrice(productIds, menuIds) {
    let price = 0;

    const getProductPrice = async (productId) => {
        const product = await Product.fetchById(productId);
        return product && product.price || 0;
    };

    if (_.isArray(productIds)) {
        for (const productId of productIds) {
            price += await getProductPrice(productId);
        }
    }

    if (_.isArray(menuIds)) {
        for (const menuId of menuIds) {
            const menu = await Menu.fetchById(menuId, true, {withRelated: ['products']});

            if (!_.isNil(menu) && _.isArray(menu.products)) {
                price += menu.products.reduce((acc, p) => acc + p.price, 0);
            }
        }
    }

    return price;
}

/**
 * Execute a function with data (update, create ..)
 * @param {Object} data
 * @param {Function} makeFn
 * @return {Promise.<void>}
 */
async function make(data, makeFn) {
    const productIds = data.productIds;
    const menuIds = data.menuIds;
    delete data.productIds;
    delete data.menuIds;

    data.price = await evalPrice(productIds, menuIds);
    const instance = await makeFn();
    if (_.isNil(instance)) return;

    if (_.isArray(productIds)) {
        await instance.products().attach(productIds);
    }

    if (_.isArray(menuIds)) {
        await instance.menus().attach(menuIds);
    }

    return instance.toJSON();
}

module.exports = {
    ...crud,
    async updateById(id, data) {
        return await make(data, async () => await crud.updateById(id, data, false));
    },
    async create(data) {
        return await make(data, async () => await crud.create(data, false));
    },
};
