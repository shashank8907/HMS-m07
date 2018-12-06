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
    patients.find({}, function (err, data) {
        if (err) {
            console.log('error occured while featching data- url, title,');
            console.log(err);
        }
        //By now we get all thwe objects of UserUrl
        //We pass that as a whole to our index page and iterate from there kapish?
        else {
            console.log(data);
            
        }
    });
    appointment.find({}, function (err, data) {
        if (err) {
            console.log('error occured while featching data- url, title,');
            console.log(err);
        }
        //By now we get all thwe objects of UserUrl
        //We pass that as a whole to our index page and iterate from there kapish?
        else {
            console.log(data);
            
        }
    });
    doctor.find({}, function (err, data) {
        if (err) {
            console.log('error occured while featching data- url, title,');
            console.log(err);
        }
        //By now we get all thwe objects of UserUrl
        //We pass that as a whole to our index page and iterate from there kapish?
        else {
            console.log(data);
            
        }
    });
    
});

//Here we include port that we want our application to run on 
app.listen(3000, function () {
    console.log("The port is listening at 3000");
});