'use strict';

const { HttpError } = require('node-common');
const Repository = require('../repositories');

/**
 * @description create a new user
 * @method POST
 */
exports.createUser = async (data, context) => {
    try {
        const Repo = new Repository();
        const user = await Repo.get('user').find(context.id);

        return {
            message: 'user profile retrieved',
            data: {}
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

/**
 * @description get user data
 * @method GET
 */
exports.getUser = async (data, context) => {
    try {
        const Repo = new Repository();
        const user = await Repo.get('user').find(context.id);

        return {
            message: 'user data retrieved',
            data: { ...user }
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};


module.exports = exports;
