const _ = require('lodash');
const {Menu} = require('../models');
const crud = require('./utils/crud')(Menu);

module.exports = {
    ...crud,
    async updateById(id, data) {
        const productIds = data.productIds;
        delete data.productIds;

        const instance = await crud.updateById(id, data, false);

        if (_.isArray(productIds)) {
            await instance.products().attach(productIds);
        }

        return instance.toJSON();
    },
    async create(data) {
        const productIds = data.productIds;
        delete data.productIds;

        const instance = await crud.create(data, false);

        if (_.isArray(productIds)) {
            await instance.products().attach(productIds);
        }

        return instance.toJSON();
    },
};
