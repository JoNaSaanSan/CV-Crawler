var express = require('express');
var userIO = express.Router();

const mongoose = require('mongoose');

// Make Mongoose use `findOneAndUpdate()`.
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
userIO.route('/userRegistration').post((req,res) =>{
    const name = req.body.name;
    const cvURL = req.body.url;
    const email = req.body.email;
    const newUser = new User({
        name, 
        email,
        cvURL
    })
    if(name != '' && cvURL != '' && email != ''){  //If required variables are not empty
    User.findOne({"email": email},function(err, foundEmail){ //see if User with this mail already exists
       User.findOne({"name": name}, function(err, foundName){ //see if User with this namealready exists
          User.findOne({"cvURL": cvURL}, function(err, foundCVURL){ //see if User with this cvurl already exists
        if(foundEmail || foundName || foundCVURL){  // add foundEmail after testing!
            res.json({message: "User with this name, email or URL already exists!"}); //return error message
        }else{
            newUser.save()
        .then(newUser =>{
            res.json({message:"User saved successfully"}) //returns success msg after successfully saving the user
        })
        .catch(err =>{
            console.log(err);
        })}})
        })})
        }else{
            res.json({message:"Field empty!"}); //return error message
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

    if(name != '' && cvURL != '' && email != ''){ //if not empty
    User.findOne({"name": name, "cvURL":cvURL, "email": email},function(err, foundUser){ 
        if(!foundUser){ //if no such user
        res.json({message: "User does not exist!"}); //return error 
    } else{
        if(foundUser){ //if user exists
            res.json({message: "User exists!"}); //return success
        }
    }
})
    } else{
    res.json({message:"Field empty!"}); //return error
}})


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
                        })
                        .catch(err => {
                            console.log(err);
                        })

                }
            }
    })    
})


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
userIO.route('/getUserSettings').post((req,res) =>{
    const name = req.body.name;
    const cvURL = req.body.url;
    User.findOne({"name" : name, "cvURL": cvURL}, function(err, foundUser){
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