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
    keywords: [String],
    emailLimit: Number, 
    newInfo: Boolean
});


const User = mongoose.model('User', userSchema);
module.exports = User;