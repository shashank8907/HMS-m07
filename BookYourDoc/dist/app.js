"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _redis = require("redis");

var _redis2 = _interopRequireDefault(_redis);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.set('debug', true); //Added at 17:57 -- latest

// var path = require('path'); //Core module that is included nodejs
// var express = require('express');

//This is the js file that deals with service


// var mongoose = require('mongoose');


//Create Redis client to run commands
var client = _redis2.default.createClient();

client.on('connect', function (param) {
    console.log("Connected to redis...");
});

//BRING IN MODELS
//Model for patients
var Patients = require('./model/patient'); //patients is now our object that we use to retrieve or add to in mlab

// Model for Doctor
var Doctor = require('./model/docs');

//model for appointment
var Appointment = require('./model/appointment');

//get route
var router = _express2.default.Router();

//Body parser --using body parser will allow you to access req.body
var bodyParser = require('body-parser');

//Init App 
var app = (0, _express2.default)();

//add for form data 
app.use(bodyParser());

//Load View Engine   ---setting where the views are located and seting our engine and extention for our file
app.set('views', _path2.default.join(__dirname, '../views'));
app.set('view engine', 'pug');

//We are connecting to our db -- milestone is our db and in that we are creating two collections users and urls
_mongoose2.default.connect('mongodb://shashank:shashank1@ds125574.mlab.com:25574/hospital_management_system');
//Getting the object of connection
var db = _mongoose2.default.connection;

//Check connection -- to check if we are actually connected
db.once('open', function () {
    console.log('Connected to mongo DB');
});

//Check th db --make sure that there are no db errors 
db.on('error', function (err) {
    console.log(err);
});

//Dummy routes that redirects to delete1 and delete2 for testing session tracking for doctor login
app.post('/delete1', function (req, res) {
    //Before rendering the page we check if the redis contains username or not 
    console.log("The delete page has: " + req.body.userName);
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
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;
    var user_name = req.body.user_name;
    var password = req.body.password;
    var spec = req.body.spec;
    var about = req.body.about;
    var at_hospital = req.body.at_hospital;
    //Assign data from front end to the doctor object
    var doctor = new Doctor();
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
            console.log("The data is stored successfully in mongo DB -Doc reg");
            //Here we store username and password in redis and then redirect with user name as hashset name
            //Insted of storing the data with the name of the user we can store it as doctor as there can be only one doctor
            client.hmset(user_name, ['user_name_r', user_name, 'first_name_r', first_name, 'last_name_r', last_name, 'password_r', password, 'spec_r', spec, 'about_r', about, 'at_hospital_r', at_hospital], function (err, reply) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("The data is stroed successfully to redis -Doc reg");
                    //check if what we atre storing in db is also stored in the redis
                    //We can remove this code while refactoring because if the control comes here then it means the data is stored successfully
                    client.hgetall(user_name, function (err, obj) {
                        if (err) {
                            console.log(err);
                        }
                        if (!obj) {
                            //If we dont have any username in our we will redirect to a login page Add a message saying login again
                            //If the control comes here we can see err and reply in the log
                            res.redirect('/allDocsPage');
                        } else {
                            //If the username is present in redis
                            console.log(obj.user_name_r + " is present in redis");
                            res.render('docsDashboard', {
                                userName: obj.user_name_r
                            });
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
    var user_name = req.body.user_name;
    var password = req.body.password;
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

            } else {}
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