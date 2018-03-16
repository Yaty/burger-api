module.exports = function(model) {

    /**
     * Find all menus
     * @return {Promise.<[]>}
     */
    async function fetchAll() {
        return await model.fetchAll();
    }

    return {
        fetchAll,
    };
};
