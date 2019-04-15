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
        await Repo.get('user').create(data);

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
 * @description get user list
 * @method GET
 */
exports.getUserList = async (data, context) => {
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

/**
 * @description get user details
 * @method GET
 */
exports.getUserDetail = async (data, context) => {
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

/**
 * @description update user details
 * @method PUT
 */
exports.updateUser = async (data, context) => {
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

/**
 * @description delete user
 * @method DELETE
 */
exports.deleteUser = async (data, context) => {
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
