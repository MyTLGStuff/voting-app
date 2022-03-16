const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    voted: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('users', user);