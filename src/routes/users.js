const {User} = require('../controllers');
const logger = require('../utils/logger')('users-router');
const express = require('express');
const router = new express.Router();
const crud = require('./utils/crud');

const validations = {};

crud(router, User, validations, logger);

module.exports = router;
