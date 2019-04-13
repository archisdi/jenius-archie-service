'use strict';

const { HttpError } = require('node-common');
const JWT = require('../utils/libs/jwt');
const AdminRepository = require('../repositories/admin_repo');
const parseDataObject = require('../utils/helpers').parseDataObject;

const generateContext = async (payload) => {
    const AdminRepo = new AdminRepository();
    const admin = await AdminRepo.find(payload.uid);

    return parseDataObject({
        id: admin.id,
        name: admin.name
    });
};

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) throw HttpError.NotAuthorized('token not provided');
        try {
            const payload = await JWT.verify(token);
            req.auth = await generateContext(payload);
        } catch (err) {
            const message = err.message === 'jwt expired' ? 'token expired' : 'invalid token';
            throw HttpError.NotAuthorized(message);
        }
        return next();
    } catch (err) {
        return next(err);
    }
};
