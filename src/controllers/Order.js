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

    const getProductPrice = async ({p, pId}) => {
        const product = p || await Product.fetchById(pId, true, {withRelated: ['promotions']});

        if (_.isObject(product)) {
            if (_.isArray(product.promotions)) {
                const reduction = product.promotions
                    .reduce((maxPromo, p) => p.value > maxPromo ? p.value : maxPromo, 0);
                return Math.max(product.price - product.price * reduction / 100, 0);
            }

            return product.price;
        }

        return 0;
    };

    if (_.isArray(productIds)) {
        for (const productId of productIds) {
            price += await getProductPrice({pId: productId});
        }
    }

    if (_.isArray(menuIds)) {
        for (const menuId of menuIds) {
            const menu = await Menu.fetchById(menuId, true, {withRelated: ['products', 'promotions']});

            if (!_.isNil(menu) && _.isArray(menu.products)) {
               for (const product of menu.products) {
                   price += await getProductPrice({p: product});
               }
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
