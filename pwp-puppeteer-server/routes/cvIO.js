var express = require('express');
var cvIO = express.Router();

const mongoose = require('mongoose');

// Make Mongoose use `findOneAndUpdate()`.
mongoose.set('useFindAndModify', false);
const User = require('../models/userSchema');
const CV = require('../models/cvSchema');

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

cvIO.get('/saveuser', (req, res) => {

});

//saves the user name, email, CVurl to the database
cvIO.route('/userRegistration').post((req,res) =>{
    const name = req.body.name;
    const cvURL = req.body.url;
    const email = req.body.email;
    const newUser = new User({
        name, 
        email,
        cvURL
    })
    if(name != '' && cvURL != '' && email != ''){
    User.findOne({"email": email},function(err, foundEmail){
       User.findOne({"name": name}, function(err, foundName){
          User.findOne({"cvURL": cvURL}, function(err, foundCVURL){
        if(foundEmail || foundName || foundCVURL){  // add foundEmail after testing!
            //console.log(foundEmail, foundName, foundCVURL);
            res.json({message: "User with this name, email or URL already exists!"});
        }else{
            newUser.save()
        .then(newUser =>{
            res.json({message:"User saved successfully"})
        })
        .catch(err =>{
            console.log(err);
        })}})
        })})
        }else{
            res.json({message:"Field empty!"});
        }
})


//checks if the user who wants to log in is in the database
cvIO.route('/userLogin').post((req,res) =>{
    const name = req.body.name;
    const cvURL = req.body.url;
    const email = req.body.email;

    if(name != '' && cvURL != '' && email != ''){
    User.findOne({"name": name, "cvURL":cvURL, "email": email},function(err, foundUser){ //add name and cvurl after testing
        if(!foundUser){
        res.json({message: "User does not exist!"});
    } else{
        if(foundUser){
            res.json({message: "User exists!"});
        }
    }
})
    } else{
    res.json({message:"Field empty!"});
}
})


//updates the user settings when new info is sent
cvIO.route('/updateSettings').post((req,res) =>{
   // const {url,keywords,emailLimit,newInfo} = req.body
    const name = req.body.name;
    const cvURL = req.body.url;
    const keywords = req.body.keywords;
    const emailLimit = req.body.emailLimit;
    const newInfo = req.body.newInfo;
    const newUserSettings = { $set:{
        keywords, 
        emailLimit,
        newInfo
    }}
    if(newInfo === true){
        User.findOne({"name" : name, "cvURL": cvURL},function(err, foundUser){
            if(err){
                console.log(err);
                res.status(500).send();
            }else{
                if(!foundUser){
                    res.status(404).send();
                } else{
                    User.updateOne(foundUser, newUserSettings, {overwrite: true})
                        .then(updated =>{
                            res.json({message:"Settings saved successfully"})
                        })
                        .catch(err =>{
                            console.log(err);
                        })
                    
                }    
            }
            
        })
    }
})   

//deletes the User from the database
cvIO.route('/deleteUser').post((req,res) =>{
    const name = req.body.name;
    const cvURL = req.body.url;
    
    User.findOne({"name" : name, "cvURL": cvURL},function(err, foundUser){
        if(err){
            console.log(err);
            res.status(500).send();
        }else{
            if(!foundUser){
                res.status(404).send();
            }else{
                User.deleteOne(foundUser)
                 .then(deleted =>{
                  res.json({message:"User deleted successfully"})
                      })
                 .catch(err =>{
                  console.log(err);
                 })
            }
        }
    })
})
//fetches the current settings to display them in the database
cvIO.route('/getUserSettings').post((req,res) =>{
    const name = req.body.name;
    const cvURL = req.body.url;
    User.findOne({"name" : name, "cvURL": cvURL}, function(err, foundUser){
        res.send(foundUser);
    })
})



//here you can see the current DB entries
cvIO.route('/getSettings').get((req,res) =>{
    User.find()  //ById("6016aee8f93461654cf6a0cf")
        .then(foundSettings => res.json(foundSettings));
})


module.exports = cvIO;