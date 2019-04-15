'use strict';

const { HttpError, JobWorker } = require('node-common');
const Repository = require('../repositories');

const retrieveUserCachedData = async (id) => {
    const Repo = new Repository();
    const cache = await Repo.get('cache').get(`user::${id}`);
    return cache ? JSON.parse(cache) : null;
};

/**
 * @description create a new user
 * @method POST
 */
exports.createUser = async (data, context) => {
    try {
        const { body } = data;
        const Repo = new Repository();

        /** will iterate to object key to generate search query to prevent duplication in every key given */
        const query = Object.keys(body).map(key => ({ [key]: body[key] }));
        const user = await Repo.get('user').findOne({ $or: query });

        if (user) throw HttpError.BadRequest('user already exsist');

        /** create new user */
        const newUser = await Repo.get('user').create(body);

        /** cache new user data asynchronous */
        await JobWorker.dispatch('cache-user', { id: newUser.id, ...body });

        return {
            message: 'new user created',
            data: {
                id: newUser.id, email: newUser.email, account_number: newUser.account_number, identity_number: newUser.identity_number
            }
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

        /** try to retrive user data from cache, only works if data retrieval using id */
        let user = await retrieveUserCachedData(id);

        /** will retrieve user based on id, account number or identity number */
        if (!user) user = await Repo.get('user').findOne({ $or: [{ _id: id }, { account_number: id }, { identity_number: id }] });
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
        const { body, params: { id } } = data;
        const Repo = new Repository();

        /** will iterate to object key to generate search query to prevent duplication in every key given */
        const query = Object.keys(body).map(key => ({ [key]: body[key] }));
        const user = await Repo.get('user').findOne({ $or: query, _id: { $ne: id } });

        if (user) throw HttpError.BadRequest('one of user attributes already taken by another user');

        /** update user data */
        await Repo.get('user').updateOne({ _id: id }, { ...body });

        /** update user cache asynchronous */
        await JobWorker.dispatch('cache-user', { id, ...body });

        return {
            message: 'user data updated'
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

/**
 * @description delete a user
 * @method DELETE
 */
exports.deleteUser = async (data, context) => {
    try {
        const { params: { id } } = data;
        const Repo = new Repository();

        /** will retrieve user based on id, account number or identity number */
        const user = await Repo.get('user').findOne({ _id: id });
        if (!user) throw HttpError.NotFound('user not found');

        /** delete user */
        await Repo.get('user').deleteOne({ _id: id });

        return {
            message: 'user data deleted'
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};


module.exports = exports;
