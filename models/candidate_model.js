const mongoose = require('mongoose');
const user_model = require('./user_model');
const Schema = mongoose.Schema;

const candidate = new Schema({
    name: {
        type: String,
        required: true
    },
    srcUrl: {
        type: String,
        default: 'https://user-images.githubusercontent.com/24848110/33519396-7e56363c-d79d-11e7-969b-09782f5ccbab.png'
    },
    altText: {
        type: String,
        default: null
    },
    votes: {
        type: Number,
        default: 0
    },
    createdBy: {
        type: String,
        required: true
    }
})
module.exports = mongoose.model('muscle-cars', candidate);