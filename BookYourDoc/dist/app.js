"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.set('debug', true); //Added at 17:57 -- latest

// var path = require('path'); //Core module that is included nodejs
// var express = require('express');

//This is the js file that deals with service


// var mongoose = require('mongoose');


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
            console.log("The data is stored successfully");
        }
    });
});
//Route for login form
app.post('/doc/login', function (req, res) {
    // here in request bodu we have all the data --extract it
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
        // If user is found!
        console.log(doc._id + "  YYYYYYYYY  " + doc.password + "     " + doc.userName);

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