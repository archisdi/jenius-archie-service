const { HttpError } = require('node-common');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);

const Jwt = require('../../utils/libs/jwt');

const { Schema, model, Types } = mongoose;
const options = { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true } };

const RefreshTokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    expired_at: {
        type: Date,
        required: true
    }
}, { versionKey: false, _id: false });

const AdminSchema = new Schema({
    _id: {
        type: Types.UUID,
        default: uuid.v4
    },
    name: {
        type: String
    },
    username: {
        type: String
    },
    password: {
        type: String
    },
    refresh_token: {
        type: RefreshTokenSchema
    }
}, options);

const createTokens = async (admin) => {
    const token = await Jwt.create({ uid: admin.id });
    const refresh = await Jwt.generateRefreshToken();
    return {
        token,
        refresh
    };
};

AdminSchema.method({
    async sign() {
        const { token, refresh } = await createTokens(this);
        await this.updateOne({ refresh_token: { token: refresh.token, expired_at: refresh.validity } });
        return {
            token, refresh: refresh.token
        };
    },
    async signIn(password) {
        if (!bcrypt.compareSync(password, this.password)) throw HttpError.NotAuthorized('credentials not match');
        const { token, refresh } = await createTokens(this);
        await this.updateOne({ refresh_token: { token: refresh.token, expired_at: refresh.validity } });
        return {
            token, refresh: refresh.token
        };
    },
    signByRefresh() {
        if (moment() > moment(this.refresh_token.expired_at)) throw HttpError.NotAuthorized('refresh token expired');
        return Jwt.create({ uid: this.id });
    }
});

AdminSchema.pre('save', async function (next) {
    const admin = this;
    if (admin.isModified('password') && admin.password) admin.password = bcrypt.hashSync(admin.password, 10);
    return next();
});

module.exports = model('Admin', AdminSchema, 'admins');
