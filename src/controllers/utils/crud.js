const _ = require('lodash');

module.exports = function(model) {
    /**
     * Find all data from a model
     * @param {Object} where, optional
     * @param {Number=} limit
     * @param {Boolean} json
     * @return {Array}
     */
    async function fetchAll(where = {}, limit, json = true) {
        const data = await model.forge().query((q) => {
            if (_.isNumber(limit) && limit > 0) q.limit(limit);
        }).where(where).fetchAll();

        return json === true ? data.toJSON() : data;
    }

    /**
     * Find a data by it's ID
     * @param {String} id
     * @param {Boolean} json
     * @param {Object=} options
     * @return {Object|Model}
     */
    async function fetchById(id, json = true, options) {
        const item = await model.forge({id}).fetch(options);

        if (!_.isNil(item)) {
            return json === true ? item.toJSON({omitPivot: true}) : item;
        }

        return undefined;
    }

    /**
     * Count the rows from a model
     * @param {Object} where, optional
     * @return {Promise.<*>}
     */
    async function count(where = {}) {
        return await model.where(where).count();
    }

    /**
     * Destroy by ID and detach attached models
     * @param {String} id
     * @return {Boolean} destroyed
     */
    async function destroyById(id) {
        const item = await fetchById(id, false);

        if (_.isNil(item)) {
            return false;
        }

        const relations = Object.keys(item.relationships);
        const itemWithRelations = await fetchById(id, true, {withRelated: relations});

        for (const relation of relations) {
            const data = itemWithRelations[relation];

            if (!_.isArray(data) || !_.isFunction(item[relation])) {
                continue;
            }

            const ids = data.map((d) => d.id);

            if (_.isFunction(item[relation]().detach)) {
                await item[relation]().detach(ids);
            }
        }

        await item.destroy();
        return true;
    }

    /**
     * Create an item
     * @param {Object} data
     * @param {Boolean} json
     * @return {Promise.<Object>}
     */
    async function create(data, json = true) {
        if (_.isObject(data)) {
            data.created_at = new Date();
            const res = await model.forge(data).save();
            return json === true ? res.toJSON() : res;
        }

        return undefined;
    }

    /**
     * Find if an item exist
     * @param {Object} data
     * @return {Promise.<boolean>}
     */
    async function exists(data) {
        if (!_.isEmpty(data)) {
            return !_.isNil(await model.forge(data).fetch());
        }

        return false;
    }

    /**
     * Update item by ID
     * @param {String} id
     * @param {Object} data
     * @param {Boolean} json
     * @return {Promise.<Object|null>}
     */
    async function updateById(id, data, json = true) {
        const item = await fetchById(id, false);

        if (!_.isNil(item) && _.isObject(data)) {
            data.updated_at = new Date();
            const updated = await item.save(data, {patch: true});
            return json === true ? updated.toJSON() : updated;
        }

        return undefined;
    }

    return {
        count,
        create,
        destroyById,
        exists,
        fetchAll,
        fetchById,
        updateById,
    };
};
