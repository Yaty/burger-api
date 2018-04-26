const _ = require('lodash');
const errors = require('../../utils/errors');

const isAdmin = (roles) => roles.includes('admin');
const isAuthenticated = (roles) => roles.includes('authenticated');
const allow = (next) => next();
const forbid = (next) => next(errors.unauthorized());

/**
 * If admin middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {*}
 */
function ifAdmin(req, res, next) {
    return isAdmin(res.locals.roles) ? allow(next) : forbid(next);
}

/**
 * If authenticated middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {*}
 */
function ifAuthenticated(req, res, next) {
    return isAuthenticated(res.locals.roles) ? allow(next) : forbid(next);
}

/**
 * If owner middleware
 * It will check if the model asked in the route is owned by the user
 * @param {Function} model
 * @return {Function}
 */
function ifOwner(model) {
    return async function(req, res, next) {
        if (isAdmin(res.locals.roles)) return allow(next);

        const modelId = req.params.id;
        const userId = res.locals.user && res.locals.user.id;
        if (_.isNil(model) || _.isNil(modelId) || _.isNil(userId)) return forbid(next);

        const instance = await model.fetchById(modelId);
        if (_.isNil(instance)) return forbid(next);
        return instance.userId === userId || instance.id === userId ? allow(next) : forbid(next);
    };
}

/**
 * If anyone middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {*}
 */
function ifAnyone(req, res, next) {
    return allow(next);
}

/**
 * Unauthorized middleware
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 * @return {*}
 */
function unauthorized(req, res, next) {
    return forbid(next);
}

module.exports = {
    ifAdmin,
    ifAuthenticated,
    ifOwner,
    ifAnyone,
    unauthorized,
};
