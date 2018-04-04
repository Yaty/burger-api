const errors = require('../../utils/errors');

module.exports = {
    ifAdmin(req, res, next) {
        if (res.locals.roles.includes('admin')) return next();
        return next(errors.unauthorized());
    },
    ifAuthenticated(req, res, next) {
        if (res.locals.roles.includes('authenticated') || res.locals.roles.includes('admin')) {
            return next();
        }

        return next(errors.unauthorized());
    },
    ifUnauthenticated(req, res, next) {
        if ((res.locals.roles.length === 1 && res.locals.roles[0] === 'everyone') || res.locals.roles.includes('admin')) {
            return next();
        }

        return next(errors.unauthorized());
    },
    ifOwner(req, res, next) {
        // TODO : get model in route, then fetch model and check
        // checkAccessControl(res.locals.roles, ['authenticated'], next);
        next();
    },
    ifAnyone(req, res, next) {
        next();
    },
    unauthorized(req, res, next) {
        next(errors.unauthorized());
    },
};
