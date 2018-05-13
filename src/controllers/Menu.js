const _ = require('lodash');
const {Menu} = require('../models');
const crud = require('./utils/crud')(Menu);

module.exports = {
    ...crud,
    async updateById(id, data) {
        const {productIds, promotionIds} = data;
        delete data.productIds;
        delete data.promotionIds;

        const instance = await crud.updateById(id, data, false);
        if (_.isNil(instance)) return;

        if (_.isArray(productIds)) {
            await instance.products().attach(productIds);
        }

        if (_.isArray(promotionIds)) {
            await instance.promotions().attach(promotionIds);
        }

        return instance.toJSON();
    },
    async create(data) {
        const {productIds, promotionIds} = data;
        delete data.productIds;
        delete data.promotionIds;

        const instance = await crud.create(data, false);
        if (_.isNil(instance)) return;

        if (_.isArray(productIds)) {
            await instance.products().attach(productIds);
        }

        if (_.isArray(promotionIds)) {
            await instance.promotions().attach(promotionIds);
        }

        return instance.toJSON();
    },
};
