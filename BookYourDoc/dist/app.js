"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _redis = require("redis");

var _redis2 = _interopRequireDefault(_redis);

var _cookieParser = require("cookie-parser");

var _cookieParser2 = _interopRequireDefault(_cookieParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.set('debug', true); //Added at 17:57 -- latest

// var path = require('path'); //Core module that is included nodejs
// var express = require('express')

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

//Public folder
app.use(_express2.default.static('public'));

//cookies
app.use((0, _cookieParser2.default)());

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
app.get('/dash/delete1', function (req, res) {
    // all docs page redirects to docsMain if the username is not present in the cookie
    console.log("The username present now in the cookie now in /allDocsPage is:  " + req.cookies.user_name_c);
    //If it is present then check the redis 
    //If in redis it's not present then render to docsMain
    if (req.cookies.user_name_c === undefined) {
        //The user key is not present in the cookie
        res.render("index");
    } else {
        //The username is set in the cookie 

        client.hgetall(req.cookies.user_name_c, function (err, obj) {
            if (err) {
                console.log(err);
            }
            if (!obj) {
                //If we dont have any username in our we will redirect to a login page Add a message saying login again
                //If the control comes here we can see err and reply in the log
                res.redirect('/');
            } else {
                //If the username is present in redis
                console.log(obj.user_name_r + " is present in redis");
                res.render('delete1', {
                    userName: obj.user_name_r,
                    about: obj.about_r,
                    spec: obj.spec_r

                });
            }
        });
    }
});
app.get('/dash/delete2', function (req, res) {
    // all docs page redirects to docsMain if the username is not present in the cookie
    console.log("The username present now in the cookie now in /allDocsPage is:  " + req.cookies.user_name_c);
    //If it is present then check the redis 
    //If in redis it's not present then render to docsMain
    if (req.cookies.user_name_c === undefined) {
        //The user key is not present in the cookie
        res.render("index");
    } else {
        //The username is set in the cookie 

        client.hgetall(req.cookies.user_name_c, function (err, obj) {
            if (err) {
                console.log(err);
            }
            if (!obj) {
                //If we dont have any username in our we will redirect to a login page Add a message saying login again
                //If the control comes here we can see err and reply in the log
                res.redirect('/');
            } else {
                //If the username is present in redis
                console.log(obj.user_name_r + " is present in redis");
                res.render('delete2', {
                    userName: obj.user_name_r,
                    about: obj.about_r,
                    at_hospital: obj.at_hospital_r

                });
            }
        });
    }
});

//Route to our main page  
app.get('/', function (req, res) {
    //Check cookie status
    var userCookieName = req.cookies.user_name_c;
    console.log("The username present now in the cookie now in / is:  " + userCookieName);
    if (userCookieName !== undefined) {
        //Check if the user name is present in the redis 
        client.hgetall(userCookieName, function (err, obj) {
            if (err) {
                console.log(err);
            }
            if (!obj) {
                //If we dont have any username in our we will redirect to a login page Add a message saying login again
                //If the control comes here we can see err and reply in the log
                res.redirect('/allDocsPage');
            } else {
                //If the username is present in redis
                console.log(obj.user_name_r + " is present in redis this is from /");
                res.render('index', {
                    userName: obj.user_name_r
                });
            }
        });
    } else {
        //If the user is not present in the cookie
        res.render("index");
    }
});

//9:00AM - 4:00PM    --standard timings of doc
//Route for regLogin
//Here before we render the page we send our object that has all the info
//How should that object be 
app.get('/allPatientPage', function (req, res) {
    //from here we access database and get all the details of every doctor that's present in DB
    //Should we store it in redis --no not necessary

    //first get the doc's data from the DB
    Doctor.find({}).select('first_name last_name user_name spec at_hospital').exec(function (err, result) {
        var docFirstName = [];
        var docLastName = [];
        var docUserNames = [];
        var docSpecs = [];
        var timings = [];
        //result is array of userid of all document
        // console.log(result);
        //Result has array of objects
        console.log(result);
        result.forEach(function (arrayItem) {

            docFirstName.push(arrayItem.first_name.trim());
            docLastName.push(arrayItem.last_name.trim());
            docUserNames.push(arrayItem.user_name.trim());
            docSpecs.push(arrayItem.spec.trim());
            timings.push(arrayItem.at_hospital.trim());
        });

        // console.log(docFirstName);
        res.render("regAndFirstuser", {
            docFirstName: docFirstName,
            docLastName: docLastName,
            docUserNames: docUserNames,
            docSpecs: docSpecs,
            timings: timings
        });
    });
});

////REMOVE if not used anywhere in applica
// //the page to be displayed after loging and after reg this is users wallpage
// app.get('/pageAfterLoginReg', function (req, res) {
//     console.log("Hello");
//     res.render("docsDashboard");
// });

//Route where all doctors visit
app.get('/allDocsPage', function (req, res) {
    // all docs page redirects to docsMain if the username is not present in the cookie
    console.log("The username present now in the cookie now in /allDocsPage is:  " + req.cookies.user_name_c);
    //If it is present then check the redis 
    //If in redis it's not present then render to docsMain
    if (req.cookies.user_name_c === undefined) {
        //The user key is not present in the cookie
        res.render("docsMain");
    } else {
        //The username is set in the cookie 

        client.hgetall(req.cookies.user_name_c, function (err, obj) {
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
            //before storing the data we aslo set the users name as cookie
            res.cookie('user_name_c', doctor.user_name, {
                expire: 60 * 1000
            }); //1 minute
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
    // before performin any of the below code check if the users data is already present in the data or not if it's present the 
    console.log("in the cookie: " + req.cookies.user_name_c);

    var user_name_req = req.body.user_name;
    var password = req.body.password;

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
        client.hmset(doc.user_name, ['user_name_r', doc.user_name, 'first_name_r', doc.first_name, 'last_name_r', doc.last_name, 'password_r', doc.password, 'spec_r', doc.spec, 'about_r', doc.about, 'at_hospital_r', doc.at_hospital], function (err, reply) {
            if (err) {
                console.log(err);
            } else {
                console.log("The data is stroed successfully to redis -Doc reg");
                //check if what we atre storing in db is also stored in the redis
                //We can remove this code while refactoring because if the control comes here then it means the data is stored successfully
                client.hgetall(doc.user_name, function (err, obj) {
                    if (err) {
                        console.log(err);
                    }
                    if (!obj) {

                        //We set the cookie as well

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

    var userCookieName = req.cookies.user_name_c;
    // res.clearCookie(userCookieName);
    // //Remove username from redis
    // client.del(userCookieName);
    // //Check if our cookie and rediskey have been deleted
    res.clearCookie("user_name_c");
    return res.status(200).redirect('/');
});

//Here we include port that we want our application to run on 
app.listen(3000, function () {
    console.log("The port is listening at 3000");
});