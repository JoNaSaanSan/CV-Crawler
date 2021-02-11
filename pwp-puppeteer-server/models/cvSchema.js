const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Represents a cv in the cv matching service.
 */
const cvSchema = new Schema(
    {
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
        matchedCVs: [String],
        newInfo: Boolean
    }
);

const CV = mongoose.model('CV', cvSchema);
module.exports = CV;
