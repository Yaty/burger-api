const _ = require('lodash');

const isValidCode = (code) => _.isNumber(code) && code >= 100 && code <= 527;

module.exports = (logger) => {
    return (err, req, res, next) => {
        const statusCode =
            isValidCode(err.statusCode) ? err.statusCode :
            isValidCode(err.status) ? err.status : 500;

        logger[statusCode >= 500 ? 'error' : 'info']('Error handler middleware', {err, path: req.path});

        return res.status(statusCode).json({
            error: {
                statusCode,
                code: err.code,
                errors: statusCode === 400 ? err.errors : undefined,
            },
            debug: process.env.NODE_ENV === 'development' ? err : undefined,
        });
    };
};
