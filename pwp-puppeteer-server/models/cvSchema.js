const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cvSchema = new Schema(
    {
        cvURL: {
            type: String,
            unique: true
        },
        usrId: Number,
        matchedCVs: [String]
    }
);

module.exports = mongoose.model('template', cvSchema);

