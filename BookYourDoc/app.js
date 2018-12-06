//This is the js file that deals with service


var mongoose = require('mongoose');
mongoose.set('debug', true); //Added at 17:57 -- latest

var path = require('path'); //Core module that is included nodejs
var express = require('express');


//BRING IN MODELS



//Model for patients
var patients = require('./model/patient'); //patients is now our object that we use to retrieve or add to in mlab

// Model for Doctor
var doctor = require('./model/docs');

//model for appointment
var appointment = require('./model/appointment');


//get route
var router = express.Router();


//Body parser --using body parser will allow you to access req.body
var bodyParser = require('body-parser');

//Init App 
const app = express();

//add for form data 
app.use(bodyParser());

//Load View Engine   ---setting where the views are located and seting our engine and extention for our file
app.set('views', path.join(__dirname, 'views'));
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
    console.log(req.body.first_name);
    console.log(req.body.last_name);
    console.log(req.body.user_name);
    console.log(req.body.password);
    console.log(req.body.spec);
    console.log(req.body.about);
    console.log(req.body.at_hospital);




});



//Here we include port that we want our application to run on 
app.listen(3000, function () {
    console.log("The port is listening at 3000");
});