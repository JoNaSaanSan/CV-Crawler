const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    cvURL: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    emailLimit: Number,
    keywords: [String],
    newInfo: Boolean
});

module.exports = mongoose.model('user', userSchema);