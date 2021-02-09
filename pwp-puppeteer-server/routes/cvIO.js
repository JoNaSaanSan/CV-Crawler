var express = require('express');
var cvIO = express.Router();

const mongoose = require('mongoose');

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
const User = require('../models/userSchema')
const CV = require('../models/cvSchema');

/**
 * Allows for granularity in the cors policies
 */
cvIO.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,author,templateName');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


/**
 * Sends all cvs which need to be crawled in JSON format.
 */
cvIO.route('/getCVsToCrawl').get((req, res) => {
    User.find({ newInfo: true })
        .then(foundUsers => manageCVs(foundUsers))
        .then(getCVsToCrawl)
        .then(cvs => res.json(cvs));
})

/**
 * Returns all cvs with new Information.
 */
const getCVsToCrawl = async () => {
    return CV.find({ newInfo: true });
}

/**
 * Creates or updates cvs depending on if there is new information.
 * @param {User} foundUsers All users with new cv Information.
 */
const manageCVs = async (foundUsers) => {
    for (const item of foundUsers) {
        const name = item.name;
        const cvURL = item.cvURL;

        await CV.findOne({ "name": name }, async function (err, foundCV) {
            if (foundCV && foundCV.cvURL !== cvURL) {
                CV.updateOne(foundCV, { $set: { 'cvURL': cvURL, 'newInfo': true } }, { overwrite: true })
                    .then(console.log(name + " updated")
                    ).catch(err => console.log(name + "'s cv can not be updated!"));

            } else if (!foundCV) {
                const newCV = new CV({
                    name,
                    cvURL,
                    matchedCVs: [''],
                    newInfo: true
                })
                try {
                    newCV.save()
                        .then(console.log(name + " created"))
                } catch (err) {
                    console.log(name + "'s cv can not be created!")
                }
            }
        })
    }
}

/**
 * Returns all cvs.
 */
cvIO.route('/getCVs').get((req, res) => {
    CV.find()
        .then(foundSettings => res.json(foundSettings));
})

/**
 * Saves the matches for a specific cv to the database.
 */
cvIO.route('/setMatches').post((req, res) => {
    const name = req.body.name;
    const matches = req.body.matches;
    const cvURL = req.body.cvURL;
    CV.findOne({ "name": name, "cvURL": cvURL }, function (err, foundCV) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (!foundCV) {
                res.status(404).send();
            } else {
                CV.updateOne(foundCV, { $set: { 'matchedCVs': matches, 'newInfo': false } }, { overwrite: true })
                    .then(updated => {
                        res.status(200).send();
                    })
                    .catch(err => {
                        console.log(err);
                    })

            }
        }

    })

})

module.exports = cvIO;