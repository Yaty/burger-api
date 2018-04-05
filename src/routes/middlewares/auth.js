const errors = require('../../utils/errors');
const logger = require('../../utils/logger')('auth');

module.exports = {
    ifAdmin() {
        return function(req, res, next) {
            if (res.locals.roles.includes('admin')) {
                logger.debug('ifAdmin : ok');
                return next();
            }

            logger.debug('ifAdmin : ko');
            return next(errors.unauthorized());
        };
    },
    ifAuthenticated() {
        return function(req, res, next) {
            if (res.locals.roles.includes('authenticated')) {
                logger.debug('ifAuthenticated : ok');
                return next();
            }

            logger.debug('ifAuthenticated : ko');
            return next(errors.unauthorized());
        };
    },
    ifUnauthenticated() {
        return function(req, res, next) {
            if ((res.locals.roles.length === 1 && res.locals.roles[0] === 'everyone') || res.locals.roles.includes('admin')) {
                logger.debug('ifUnauthenticated : ok');
                return next();
            }

            logger.debug('ifUnauthenticated : ko');
            return next(errors.unauthorized());
        };
    },
    ifOwner() {
        return function(req, res, next) {
            // TODO : get model in route, then fetch model and check
            // checkAccessControl(res.locals.roles, ['authenticated'], next);
            logger.debug('ifOwner : ok');
            next();
        };
    },
    ifAnyone() {
        return function(req, res, next) {
            logger.debug('ifAnyone : ok');
            next();
        };
    },
    unauthorized() {
        return function(req, res, next) {
            logger.debug('unauthorized');
            next(errors.unauthorized());
        };
    },
};
