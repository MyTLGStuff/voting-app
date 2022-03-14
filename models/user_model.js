const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ThirdPartyProviderSchema = new Schema({
    provider_name: {
        type: String,
        default: null
    },
    provider_id: {
        type: String,
        default: null,
    },
    provider_dataa: {
        type: {},
        default: null
    }
})

const user = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    email_is_verified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    third_party_auth: [ThirdPartyProviderSchema],
    date: {
        type: Date,
        default: Date.now
    },
    last_vote: {
        type: Date,
        default: Date.now
    },
}, {
    strict: false
});

module.exports = mongoose.model('users', user);