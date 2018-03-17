const {Menu} = require('../controllers');
const logger = require('../utils/logger');
const express = require('express');
const router = new express.Router();

router.get('/', async (req, res, next) => {
    try {
        const res = await Menu.fetchAll();



    } catch (err) {
        logger.error('Menus get / boum', {err});
        next(err);
    }
    return res.json(await Menu.fetchAll());
});

module.exports = router;
