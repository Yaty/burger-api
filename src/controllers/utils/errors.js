/**
 * Error factory
 * @param {String} message
 * @param {String} code
 * @param {Number} statusCode
 * @return {Error}
 */
function factory(message, code, statusCode) {
    const err = new Error(message);
    err.code = code;
    err.statusCode = statusCode;
    return err;
}

module.exports = {
    notFound() {
        return factory('Not found', 'NOT_FOUND', 404);
    },
    loginFailed() {
        return factory('Login failed', 'LOGIN_FAILED', 401);
    },
    logoutFailed() {
        return factory('Logout failed', 'LOGOUT_FAILED', 401);
    },
};
