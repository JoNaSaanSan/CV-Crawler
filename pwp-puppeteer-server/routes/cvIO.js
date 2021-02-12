var express = require('express');
var cvIO = express.Router();

const mongoose = require('mongoose');

// Make Mongoose use `findOneAndUpdate()`.
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
 * Returns all cvs in JSON format.
 */
cvIO.route('/getAllCVs').get((req, res) => {
    CV.find()
        .then(foundCVs => res.json(foundCVs));
})

/**
 * Returns already crawled cvs in JSON format.
 */
cvIO.route('/getCrawledCVs').get((req, res) => {
    CV.find({ newInfo: false })
        .then(foundCVs => res.json(foundCVs));
})

/**
 * Returns all cvs with no matches yet in JSON format.
 */
cvIO.route('/getNotMatchedCVs').get((req, res) => {
    CV.find({ matchedCVs: [''] })
        .then(foundCVs => res.json(foundCVs));
})

/**
 * Returns all all keywords for a requested cv in JSON format.
 */
cvIO.route('/getKeywordsForCV').get((req, res) => {
    const name = req.body.name;
    const cvURL = req.body.cvURL;
    User.findOne({ 'name': name, 'cvURL': cvURL }, function (err, foundUser) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (!foundUser) {
                res.status(404).send();
            } else {
                res.send([{ 'name': name, 'cvURL': cvURL, 'keywords': foundUser.keywords }])
            }
        }
    })
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
                User.findOne({ "name": name, "cvURL": cvURL }, function (err, foundUser) {
                    if (err) {
                        console.log(err);
                        res.status(500).send();
                    } else {
                        User.updateOne(foundUser, { $set: { 'newInfo': false } }, { overwrite: true })
                            .then(updated => {
                                res.status(200).send();
                            })
                            .catch(err => {
                                console.log(err);
                            })
                    }
                })
            }
        }

    })

})

module.exports = cvIO;