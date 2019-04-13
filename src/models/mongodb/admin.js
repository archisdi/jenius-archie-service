const mongoose = require('mongoose');
const uuid = require('uuid');
require('mongoose-uuid2')(mongoose);

const { Schema, model, Types } = mongoose;
const options = { versionKey: false, timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true } };

const AdminSchema = new Schema({
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
    }
}, { ...options, collection: 'admins' });

module.exports = model('Admin', AdminSchema);
