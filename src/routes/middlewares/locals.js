const _ = require('lodash');
const errors = require('../../utils/errors');
const {AccessToken, User} = require('../../controllers');

module.exports = async function(req, res, next) {
    try {
        let token;

        if (_.isString(req.headers.authorization) && req.headers.authorization.toLowerCase().startsWith('bearer')) {
            token = req.headers.authorization.substring(6).trim(); // remove Bearer
        } else if (_.isString(req.query.token)) {
            token = req.query.token;
        }

        res.locals.roles = ['everyone'];

        if (_.isString(token)) {
            const tokenInstance = await AccessToken.fetchById(token, false);
            if (_.isNil(tokenInstance) || !tokenInstance.isValid()) return next(errors.unauthorized());
            res.locals.token = tokenInstance.toJSON();

            const userInstance = await User.fetchById(res.locals.token.userId, false, {withRelated: ['roles']});
            if (_.isNil(userInstance)) return next(errors.unauthorized());

            res.locals.roles.push('authenticated');
            res.locals.user = userInstance.toJSON();
            res.locals.roles.push(...res.locals.user.roles.map((r) => r.name.toLowerCase()));
        }

        return next();
    } catch (err) {
        next(err);
    }
};
