const menus = require('./menus');
const orders = require('./orders');
const products = require('./products');
const users = require('./users');
const express = require('express');
const router = new express.Router();

router.use('/menus', menus);
router.use('/orders', orders);
router.use('/products', products);
router.use('/users', users);

module.exports = router;
