'use strict';

const { HttpError } = require('node-common');
const JWT = require('../utils/libs/jwt');

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) throw HttpError.NotAuthorized('token not provided');
        try {
            req.auth = await JWT.verify(token);
        } catch (err) {
            const message = err.message === 'jwt expired' ? 'token expired' : 'invalid token';
            throw HttpError.NotAuthorized(message);
        }
        return next();
    } catch (err) {
        return next(err);
    }
};
