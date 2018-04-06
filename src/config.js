module.exports = {
    logger: {
        level: process.env.LOGGER_LEVEL,
    },
    db: {
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
    },
    admin: {
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
    },
};
