const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);

const { Schema, model, Types } = mongoose;
const options = { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true } };

const UserSchema = new Schema({
    _id: {
        type: Types.UUID,
        default: uuid.v4
    },
    username: {
        type: String,
        required: 'username is required'
    },
    email: {
        type: String,
        required: 'email is required'
    },
    account_number: {
        type: String,
        required: 'username is required'
    },
    identity_number: {
        type: String,
        required: 'id number is required'
    }
}, { ...options, collection: 'users' });

module.exports = model('User', UserSchema);
