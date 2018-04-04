const _ = require('lodash');

module.exports = async function(req, res, next) {
    if (_.isString(req.headers.authorization) && req.headers.authorization.toLowerCase().startsWith('bearer')) {
        res.locals.token = req.headers.authorization.substring(6).trim(); // remove Bearer
    } else if (_.isString(req.query.token)) {
        res.locals.token = req.query.token;
    }

    return next();
};
