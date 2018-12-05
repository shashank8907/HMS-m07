var express = require("express");
var app = express();
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
var morgan = require("morgan");
var fs = require("fs");

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(morgan("tiny"));

var doctorsRoutes = require('./routes/doctor');

app.use('/doctor',doctorsRoutes);

app.get('/',function(req,res){
 res.redirect('/doctors');
});
    
app.listen(4525,function(){
    console.log("server port :4525");
});

