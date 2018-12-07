//This is the js file that deals with service


// var mongoose = require('mongoose');
import mongoose from "mongoose";

mongoose.set('debug', true); //Added at 17:57 -- latest

// var path = require('path'); //Core module that is included nodejs
// var express = require('express');

import path from "path";
import express from "express";
import redis from "redis"


//Create Redis client to run commands
let client = redis.createClient();

client.on('connect', function (param) {
    console.log("Connected to redis...");
})

//BRING IN MODELS
//Model for patients
const Patients = require('./model/patient'); //patients is now our object that we use to retrieve or add to in mlab

// Model for Doctor
const Doctor = require('./model/docs');

//model for appointment
const Appointment = require('./model/appointment');


//get route
const router = express.Router();


//Body parser --using body parser will allow you to access req.body
const bodyParser = require('body-parser');

//Init App 
const app = express();

//add for form data 
app.use(bodyParser());

//Load View Engine   ---setting where the views are located and seting our engine and extention for our file
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

//We are connecting to our db -- milestone is our db and in that we are creating two collections users and urls
mongoose.connect('mongodb://shashank:shashank1@ds125574.mlab.com:25574/hospital_management_system');
//Getting the object of connection
var db = mongoose.connection;

//Check connection -- to check if we are actually connected
db.once('open', function () {
    console.log('Connected to mongo DB');
});

//Check th db --make sure that there are no db errors 
db.on('error', function (err) {
    console.log(err);
});



//Dummy routes that redirects to delete1 and delete2 for testing session tracking for doctor login
app.get('/delete1', function (req, res) {
    res.render("delete1");
});
app.get('/delete2', function (req, res) {
    res.render("delete2");
});

//the page to be displayed after loging and after reg this is users wallpage
app.get('/pageAfterLoginReg', function (req, res) {
    console.log("Hello");
    res.render("docsDashboard");
});



//Route to our main page  
app.get('/', function (req, res) {
    res.render("index");
});
//Rout for regLogin
app.get('/regAndBookPatient', function (req, res) {
    res.render("regAndFirstuser");
});


//Route where all doctors visit
app.get('/allDocsPage', function (req, res) {
    res.render("docsMain");
});
//Route for regestering doctor
app.post('/doc/reg', function (req, res) {
    // here in request bodu we have all the data --extract it
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let user_name = req.body.user_name;
    let password = req.body.password;
    let spec = req.body.spec;
    let about = req.body.about;
    let at_hospital = req.body.at_hospital;
    //Assign data from front end to the doctor object
    let doctor = new Doctor();
    doctor.user_name = user_name;
    doctor.first_name = first_name;
    doctor.last_name = last_name;
    doctor.password = password;
    doctor.spec = spec;
    doctor.about = about;
    doctor.at_hospital = at_hospital;
    //store the recieved data in doctor collection
    doctor.save(function (err, savedUser) {
        if (err) {
            console.log(err);
            return res.status(500).send();
        } else {
            //what happens after the user is saved in the database
            console.log("The data is stored successfully");
            //Here we store username and password in redis and then redirect with user name as hashset name

            client.hmset(user_name, [
                'user_name_r', user_name,
                'first_name_r', first_name,
                'last_name_r', last_name,
                'password_r', password,
                'spec_r', spec,
                'about_r', about,
                'at_hospital_r', at_hospital
            ], function (err, reply) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("data stroed in the client");
                    //check if what we atre storing in db is also stored in the redis
                    client.hgetall(user_name,
                        function (err, obj) {
                            console.log(obj);
                            if (err) {
                                console.log(err);
                            }
                            if (!obj) {
                                //If we dont have any username in our we will redirect to a login page Add a message saying login again
                                //If the control comes here we can see err and reply in the log
                                res.redirect('/allDocsPage');
                            } else {
                                //If the username is present in redis
                                console.log("HGETALL");
                                console.log(obj.user_name);
                                res.redirect('/pageAfterLoginReg');

                            }
                        });

                }
                console.log(reply);
            });
        }
    });

});
//Route for login form
app.post('/doc/login', function (req, res) {
    let user_name = req.body.user_name;
    let password = req.body.password;
    //Check the user name and password if present in the DB or not
    Doctor.findOne({
        user_name: user_name,
        password: password
    }, 'user_name password _id', function (err, doc) {
        if (err) {
            console.log('inside is err');
            return res.status(500).send();
        }
        if (!doc) {
            //If user not found 
            console.log(doc);
            return res.status(200).send();
        }
        //Here we store username and password in redis and then redirect
        //redis hgetall returns all the fields and values of a hash (id)
        //id can be anything that is unique in our case id = user_name





        client.hgetall(id, function (err, obj) {
            if (!obj) {
                //What to do if our obj is not in the redix server 

            } else {

            }
        });
        res.redirect('/pageAfterLoginReg');
        // If user is found!
        console.log(doc._id + "    " + doc.password + "     " + doc.userName);

        //When we get the match we redirect to main page by displaying "welcome username and adding a submit button"
        //passing our username and password to index page for display of submit button
        // res.render('index', {
        //     username: username,
        //     password: password

        // });
        //             return res.status(200).send();


    });


});




//Here we include port that we want our application to run on 
app.listen(3000, function () {
    console.log("The port is listening at 3000");
});