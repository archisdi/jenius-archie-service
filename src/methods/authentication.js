'use strict';

const { HttpError } = require('node-common');
const Config = require('../config/jwt');
const Repository = require('../repositories');

exports.login = async (data, context) => {
    try {
        const Repo = new Repository();

        const admin = await Repo.get('admin').findOne({ username: data.body.username });
        if (!admin) throw HttpError.NotAuthorized('Credentials not match');

        const { token, refresh: refreshToken } = await admin.signIn(data.body.password);
        const response = {
            token,
            refresh_token: refreshToken,
            expires_in: Config.expired
        };

        return {
            message: 'login success',
            data: response
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

exports.refresh = async (data, context) => {
    try {
        const Repo = new Repository();

        const admin = await Repo.get('admin').findOne({ 'refresh_token.token': data.body.refresh_token });
        if (!admin) throw HttpError.NotAuthorized('refresh token invalid');

        const token = await admin.signByRefresh();
        const response = {
            new_token: token,
            expires_in: Config.expired
        };

        return {
            message: 'token refreshed',
            data: response
        };
    } catch (err) {
        if (err.status) throw err;
        throw HttpError.InternalServerError(err.message);
    }
};

module.exports = exports;
