var express = require('express');
var userIO = express.Router();

const mongoose = require('mongoose');
const axios = require('axios'); 

// Make Mongoose use `findOneAndUpdate()`
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

/**
 * saves a new User with a name, email and CVURL to the database 
 */
userIO.route('/userRegistration').post((req, res) => {
    const name = req.body.name;
    const cvURL = req.body.url;
    const email = req.body.email;
    const newInfo = req.body.newInfo;
    const newUser = new User({
        name,
        email,
        cvURL,
        newInfo
    })
    if (name != '' && cvURL != '' && email != '') {  //If required variables are not empty
        User.findOne({ "email": email }, function (err, foundEmail) { //see if User with this mail already exists
            User.findOne({ "name": name }, function (err, foundName) { //see if User with this namealready exists
                User.findOne({ "cvURL": cvURL }, function (err, foundCVURL) { //see if User with this cvurl already exists
                    if (foundEmail || foundName || foundCVURL) {  // add foundEmail after testing!
                        res.json({ message: "User with this name, email or URL already exists!" }); //return error message
                    } else {
                        newUser.save()
                            .then(newUser => {
                                res.json({ message: "User saved successfully" }) //returns success msg after successfully saving the user
                                 User.find({newInfo: true})
                                 .then(foundUsers => manageCVs(foundUsers))
                                 .then(getCVsToCrawl)
                                 .then(cvs => activateCrawler(cvs))
                            })
                            
                            .catch(err => {
                                console.log(err);
                            })
                    }
                })
            })
        })
    } else {
        res.json({ message: "Field empty!" }); //return error message
    }
})

/**
 * checks if there is a user with the requested name, cvURL and email
 * to allow him to login on client, if he exists
 */
userIO.route('/userLogin').post((req, res) => {
    const name = req.body.name;
    const cvURL = req.body.url;
    const email = req.body.email;

    if (name != '' && cvURL != '' && email != '') { //if not empty
        User.findOne({ "name": name, "cvURL": cvURL, "email": email }, function (err, foundUser) {
            if (!foundUser) { //if no such user
                res.json({ message: "User does not exist!" }); //return error 
            } else {
                if (foundUser) { //if user exists
                    res.json({ message: "User exists!" }); //return success
                }
            }
        })
    } else {
        res.json({ message: "Field empty!" }); //return error
    }
})


/**
 * updates the user settings in the database (cvURL,keywords,emaillimit) 
 */
userIO.route('/updateSettings').post((req, res) => {
    const name = req.body.name;
    const email = req.body.email;
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
    User.findOne({ "name": name, "email": email }, function (err, foundUser) { //search for user with given name and email
        if (err) {
            console.log(err);
            res.status(500).send(); //server error
        } else {
            if (!foundUser) {
                res.status(404).send(); //User not found error
            } else {
                User.updateOne(foundUser, newUserSettings, { overwrite: true }) //Update user settings in the database with the newUserSettings
                    .then(updated => {
                        res.json({ message: "Settings saved successfully" }) //return success
                        //if(foundUser.newInfo === true){activateCrawler(foundUser)}
                        User.find({newInfo: true})
                        .then(foundUsers => manageCVs(foundUsers))
                        .then(getCVsToCrawl)
                        .then(cvs => activateCrawler(cvs))
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    })
})

/**
 * Function that sends a POST request to the crawler group with all current users that need to be crawled
 * @param {*} userCVs all entries of the CV database that have new Info
 */
const activateCrawler = async (userCVs) => {
    const userarray = [];
    userCVs.forEach(user => {
        const userdata = {
            name: user.name,
            cvURL: user.cvURL,
            newInfo: user.newInfo
           }
           userarray.push(userdata);
    });
   console.log(userarray)
 axios.post('https://pwp.um.ifi.lmu.de/g10/crawl', userarray)
 .then((res) =>{
     console.log(`statuscode: ${res.statuscode}`)
     console.log(res)
 })
 .catch((error) =>{
     console.error(error)
 })
}


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
 * deletes a given User from the database 
 */
userIO.route('/deleteUser').post((req, res) => {
    const name = req.body.name;
    const email = req.body.email;

    User.findOne({ "name": name, "email": email }, function (err, foundUser) { //search for the user
        if (err) {
            console.log(err);
            res.status(500).send(); //server error
        } else {
            if (!foundUser) {
                res.status(404).send(); //User not found error
            } else {
                User.deleteOne(foundUser) //delete User 
                    .then(deleted => {
                        res.json({ message: "User deleted successfully" }) // and return success
                    })
                    .catch(err => {
                        console.log(err);
                    })
            }
        }
    })
})

/**
 * fetches the current user settings of a specific User and returns them
 */
userIO.route('/getUserSettings').post((req, res) => {
    const name = req.body.name;
    const cvURL = req.body.url;
    User.findOne({ "name": name, "cvURL": cvURL }, function (err, foundUser) {
        res.send(foundUser);
    })
})




/**
 * returns all the current User entries in the DB
 */
userIO.route('/getUsers').get((req, res) => {
    User.find()
        .then(foundUsers => res.json(foundUsers));
})


module.exports = userIO;