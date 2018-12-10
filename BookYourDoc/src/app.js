//This is the js file that deals with service


// var mongoose = require('mongoose');
import mongoose from "mongoose";

mongoose.set('debug', true); //Added at 17:57 -- latest

// var path = require('path'); //Core module that is included nodejs
// var express = require('express');

import path from "path";
import express from "express";
import redis from "redis"
import cookieParser from "cookie-parser"



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

//cookies
app.use(cookieParser());

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
app.post('/delete1', function (req, res) {
    //Before rendering the page we check if the redis contains username or not 
    console.log("The delete1 page has: " + req.body.userName);
    if (req.body.userName != undefined) {
        //perform this only if the username is present in the database
        client.hgetall(req.body.userName,
            function (err, obj) {
                if (err) {
                    console.log(err);
                }
                if (!obj) {
                    //If we dont have any username in our we will redirect to a login page Add a message saying login again
                    //If the control comes here we can see err and reply in the log
                    res.redirect('/allDocsPage');
                } else {
                    //If the username is present in redis
                    res.render('delete1', {
                        userName: obj.user_name_r

                    });
                }
            });
    }
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
    //check if the user in present in the redis if so then redirect dashboard
    res.render("index");
});
//Rout for regLogin
app.get('/regAndBookPatient', function (req, res) {
    res.render("regAndFirstuser");
});


//Route where all doctors visit
app.get('/allDocsPage', function (req, res) {
    //Before redirecting the page to login we ccheck if any username is present in redis or not
    //Before we check if the username and password is present in the DB we check if it present in the redis
    let user_name_c = req.cookies.user_name_c;
    if (user_name_c) {
        client.hgetall(user_name_c,
            function (err, obj) {
                if (err) {
                    console.log(err);
                }
                if (!obj) {

                    //Do nothing if that object is not found
                } else {
                    //If the username is present in redis
                    console.log(obj.user_name_r + " is present in redis and in clookie so auto login");
                    res.render('docsDashboard', {
                        userName: obj.user_name_r
                    });
                }
            });

    }



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
            console.log("The data is stored successfully in mongo DB -Doc reg");
            //before storing the data we aslo set the users name as cookie
            res.cookie('user_name_c', doctor.user_name, {
                expire: 60 * 1000
            }); //1 minute
            //Here we store username and password in redis and then redirect with user name as hashset name
            //Insted of storing the data with the name of the user we can store it as doctor as there can be only one doctor
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
                    console.log("The data is stroed successfully to redis -Doc reg");
                    //check if what we atre storing in db is also stored in the redis
                    //We can remove this code while refactoring because if the control comes here then it means the data is stored successfully
                    client.hgetall(user_name,
                        function (err, obj) {
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
    // before performin any of the below code check if the users data is already present in the data or not if it's present the 
    console.log("in the cookie: " + req.cookies.user_name_c)


    let user_name_req = req.body.user_name;
    let password = req.body.password;


    //Check the user name and password if present in the DB or not
    Doctor.findOne({
        user_name: user_name_req,
        password: password
    }, 'user_name password _id first_name last_name spec about at_hospital', function (err, doc) {
        if (err) {
            console.log('inside is err');
            return res.status(500).send();
        }
        if (!doc) {
            //If user not found 
            console.log(doc);
            return res.status(200).send();
        }
        //After doc loggs in add cookie
        res.cookie('user_name_c', doc.user_name, {
            expire: 60 * 1000
        }); //1 minute
        //Control comes here if the user is present in the DB
        //Here we set/get? we set the obtained username along with it's values in redis -same as reg
        client.hmset(doc.user_name, [
            'user_name_r', doc.user_name,
            'first_name_r', doc.first_name,
            'last_name_r', doc.last_name,
            'password_r', doc.password,
            'spec_r', doc.spec,
            'about_r', doc.about,
            'at_hospital_r', doc.at_hospital
        ], function (err, reply) {
            if (err) {
                console.log(err);
            } else {
                console.log("The data is stroed successfully to redis -Doc reg");
                //check if what we atre storing in db is also stored in the redis
                //We can remove this code while refactoring because if the control comes here then it means the data is stored successfully
                client.hgetall(doc.user_name,
                    function (err, obj) {
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

    });


});


app.post('/doc/logout', function (req, res) {

    let cookieName = req.cookies.user_name_c;
    res.clearCookie(cookieName);
    //Remove username from redis
    client.del(cookieName);
    //Check if our cookie and rediskey have been deleted


    
    //render main page again
    res.render("index");
});




//Here we include port that we want our application to run on 
app.listen(3000, function () {
    console.log("The port is listening at 3000");
});