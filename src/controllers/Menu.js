const {Menu} = require('../models');

/**
 * Find all menus
 * @return {Promise.<[]>}
 */
async function fetchAll() {
    return await Menu.fetchAll();
}

module.exports = {
    fetchAll,
};

