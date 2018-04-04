module.exports = {
    ifAdmin(req, res, next) {
        next();
    },
    ifAuthenticated(req, res, next) {
        next();
    },
    ifUnauthenticated(req, res, next) {
        next();
    },
    ifOwner(req, res, next) {
        next();
    },
};
