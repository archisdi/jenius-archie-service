'use strict';

const Joi = require('joi');
const { HttpError } = require('node-common');

const GENERAL_STRING = Joi.string().min(4).max(25).required();
const GENERAL_ID = Joi.string().required();

const schemas = {
    login: Joi.object({
        body: Joi.object({
            username: Joi.string().required(),
            password: Joi.string().required()
        }).required()
    }),
    refresh: Joi.object({
        body: Joi.object({
            refresh_token: Joi.string().required()
        }).required()
    }),
    userList: Joi.object({
        query: Joi.object({
            page: Joi.number().integer().positive().default(1)
                .optional(),
            limit: Joi.number().integer().positive().default(5)
                .optional()
        }).required()
    }),
    userCreate: Joi.object({
        body: Joi.object({
            username: GENERAL_STRING,
            email: Joi.string().email().required(),
            account_number: GENERAL_STRING,
            identity_number: GENERAL_STRING
        }).required()
    }),
    userUpdate: Joi.object({
        params: Joi.object({
            id: GENERAL_ID
        }).required(),
        body: Joi.object({
            username: GENERAL_STRING,
            email: Joi.string().email().required(),
            account_number: GENERAL_STRING,
            identity_number: GENERAL_STRING
        }).required()
    })
};

const defaultOptions = {
    stripUnknown: {
        arrays: false,
        objects: true
    },
    abortEarly: false
};

module.exports = (input, schema, options = defaultOptions) => Joi.validate(input, schemas[schema], options)
    .catch((err) => {
        const details = err.details.reduce((detail, item) => {
            detail[item.context.key] = item.message.replace(/"/g, '');
            return detail;
        }, {});
        throw HttpError.UnprocessableEntity('validation error', details);
    });
