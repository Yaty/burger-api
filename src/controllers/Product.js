const _ = require('lodash');
const {Product} = require('../models');
const crud = require('./utils/crud')(Product);

module.exports = {
    ...crud,
    async updateById(id, data) {
        const {promotionIds} = data;
        delete data.promotionIds;

        const instance = await crud.updateById(id, data, false);
        if (_.isNil(instance)) return;

        if (_.isArray(promotionIds)) {
            await instance.promotions().attach(promotionIds);
        }

        return instance.toJSON();
    },
    async create(data) {
        const {promotionIds} = data;
        delete data.promotionIds;

        const instance = await crud.create(data, false);
        if (_.isNil(instance)) return;

        if (_.isArray(promotionIds)) {
            await instance.promotions().attach(promotionIds);
        }

        return instance.toJSON();
    },
};
