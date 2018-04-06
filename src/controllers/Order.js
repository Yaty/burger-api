const _ = require('lodash');
const {Order} = require('../models');
const crud = require('./utils/crud')(Order);

module.exports = {
    ...crud,
    async updateById(id, data) {
        const productIds = data.productIds;
        const menuIds = data.menuIds;
        delete data.productIds;
        delete data.menuIds;

        const instance = await crud.updateById(id, data, false);

        if (_.isArray(productIds)) {
            await instance.products().attach(productIds);
        }

        if (_.isArray(menuIds)) {
            await instance.menus().attach(menuIds);
        }

        return instance.toJSON();
    },
    async create(data) {
        const productIds = data.productIds;
        const menuIds = data.menuIds;
        delete data.productIds;
        delete data.menuIds;

        const instance = await crud.create(data, false);

        if (_.isArray(productIds)) {
            await instance.products().attach(productIds);
        }

        if (_.isArray(menuIds)) {
            await instance.menus().attach(menuIds);
        }

        return instance.toJSON();
    },
};
