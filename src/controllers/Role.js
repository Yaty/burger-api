const _ = require('lodash');
const {Role} = require('../models');
const crud = require('./utils/crud')(Role);

module.exports = {
    ...crud,
    async updateById(id, data) {
        const userIds = data.userIds;
        delete data.userIds;

        const instance = await crud.updateById(id, data, false);

        if (_.isArray(userIds)) {
            await instance.users().attach(userIds);
        }

        return instance.toJSON();
    },
    async create(data) {
        const userIds = data.userIds;
        delete data.userIds;

        const instance = await crud.create(data, false);

        if (_.isArray(userIds)) {
            await instance.users().attach(userIds);
        }

        return instance.toJSON();
    },
};

