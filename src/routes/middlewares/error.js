module.exports = (logger) => {
    return (err, req, res, next) => {
        logger[err.statusCode >= 500 || isNaN(err.statusCode) ? 'error' : 'info']('Error handler middleware', {err, path: req.path});

        return res.status(err.statusCode || 500).json({
            error: {
                statusCode: err.statusCode || 500,
                code: err.code,
            },
            debug: process.env.NODE_ENV === 'development' ? err : undefined,
        });
    };
};
