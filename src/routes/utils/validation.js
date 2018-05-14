const Joi = require('joi');

const id = Joi.number().min(0).integer().required();

module.exports = {
    mandatoryId: {
        params: {
            id,
        },
    },
    menus: {
        create: {
            body: {
                name: Joi.string().required(),
            },
        },
        update: {
            body: {
                name: Joi.string(),
            },
            params: {
                id,
            },
        },
    },
    orders: {
        create: {
            body: {},
        },
        update: {
            params: {
                id,
            },
        },
    },
    products: {
        create: {
            body: {
                price: Joi.number().min(0).required(),
                name: Joi.string().required(),
            },
        },
        update: {
            body: {
                price: Joi.number().min(0),
                name: Joi.string(),
            },
            params: {
                id,
            },
        },
    },
    users: {
        create: {
            body: {
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            },
        },
        update: {
            body: {
                email: Joi.string().email(),
                password: Joi.string(),
            },
            params: {
                id,
            },
        },
        login: {
            body: {
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            },
        },
    },
    promotions: {
        create: {
            body: {
                name: Joi.string().required(),
                value: Joi.number().min(0).max(100).required(),
            },
        },
        update: {
            body: {
                name: Joi.string(),
                value: Joi.number().min(0).max(100),
            },
            params: {
                id,
            },
        },
    },
};
