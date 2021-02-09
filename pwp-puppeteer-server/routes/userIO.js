var express = require('express');
var userIO = express.Router();

const mongoose = require('mongoose');

// Make Mongoose use `findOneAndUpdate()`. Note that this option is `true`
// by default, you need to set it to false.
mongoose.set('useFindAndModify', false);
const User = require('../models/userSchema');
const CV = require('../models/cvSchema');

userIO.use(function (req, res, next) {
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

//saves the username & cvurl to the database
userIO.route('/userLogin').post((req, res) => {
    const name = req.body.name;
    const cvURL = req.body.url;
    const email = req.body.email;
    const newUser = new User({
        name,
        cvURL,
        email
    })
    User.findOne({ "name": name }, { "cvURL": cvURL }, { "email": email }, function (err, foundUser) {
        if (foundUser) {
            res.json({ message: "User with this name, email or URL already exists!" });
        } else {
            newUser.save()
                .then(newUser => {
                    res.json({ message: "User saved successfully" })
                })
                .catch(err => {
                    console.log(err);
                })
        }
    })

})


//updates the user settings when new info is sent
userIO.route('/updateSettings').post((req, res) => {
    // const {url,keywords,emailLimit,newInfo} = req.body
    const name = req.body.name;
    const cvURL = req.body.url;
    const keywords = req.body.keywords;
    const emailLimit = req.body.emailLimit;
    const newInfo = req.body.newInfo;
    const newUserSettings = {
        $set: {
            keywords,
            emailLimit,
            newInfo,
            cvURL,
            newInfo
        }
    }
    if (newInfo === true) {
        User.findOne({ "name": name, "cvURL": cvURL }, function (err, foundUser) {
            if (err) {
                console.log(err);
                res.status(500).send();
            } else {
                if (!foundUser) {
                    res.status(404).send();
                } else {
                    User.updateOne(foundUser, newUserSettings, { overwrite: true })
                        .then(updated => {
                            res.json({ message: "Settings saved successfully" })
                        })
                        .catch(err => {
                            console.log(err);
                        })

                }
            }

        })
    }
})


//deletes the User from the database
userIO.route('/deleteUser').post((req, res) => {
    const name = req.body.name;
    const cvURL = req.body.url;

    User.findOne({ "name": name, "cvURL": cvURL }, function (err, foundUser) {
        if (err) {
            console.log(err);
            res.status(500).send();
        } else {
            if (!foundUser) {
                res.status(404).send();
            } else {
                User.deleteOne(foundUser)
                    .then(deleted => {
                        res.json({ message: "User deleted successfully" })
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    })
})



//here you can see the current DB entries
userIO.route('/getSettings').get((req, res) => {
    User.find()  //ById("6016aee8f93461654cf6a0cf")
        .then(foundSettings => res.json(foundSettings));
})


module.exports = userIO;