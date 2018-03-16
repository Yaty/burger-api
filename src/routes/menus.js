const {Menu} = require('../controllers');
const express = require('express');
const router = new express.Router();

router.get('/', async (req, res) => {
    return res.json(await Menu.fetchAll());
});

module.exports = router;
