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
        const { query: { page, limit } } = data;
        const Repo = new Repository();

        const total = await Repo.get('user').count();
        const users = await Repo.get('user').paginate({}, page, limit);

        return {
            message: 'users data retrieved',
            data: {
                data: users.map(user => ({
                    id: user.id, email: user.email, account_number: user.account_number, identity_number: user.identity_number
                })),
                meta: {
                    total_page: Math.ceil(total / limit),
                    page,
                    limit
                }
            }
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
        const { params: { id } } = data;
        const Repo = new Repository();

        /** will retrieve user based on account number or identity number */
        const user = await Repo.get('user').findOne({ $or: [{ account_number: id }, { identity_number: id }] });
        if (!user) throw HttpError.NotFound('user not found');

        return {
            message: 'user data retrieved',
            data: {
                id: user.id, username: user.username, email: user.email, account_number: user.account_number, identity_number: user.identity_number
            }
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
