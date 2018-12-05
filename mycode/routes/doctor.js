var express = require('express');
var router = express.Router();

router.get('/doctors',function(req,res){
// db.Doctor.find().then(function(doctors){
   res.render('index');
    // },function(err){
    // res.send("error");
    // })
});
module.exports = router;

