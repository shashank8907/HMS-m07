//This is the js file that deals with service


// var mongoose = require('mongoose');
import mongoose from "mongoose";

mongoose.set('debug', true); //Added at 17:57 -- latest

// var path = require('path'); //Core module that is included nodejs
// var express = require('express');

import path from "path";
import express from "express";

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



//Dummy route that redirects to delete1.pug
app.get('/', function (req, res) {
    res.render("delete1");
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