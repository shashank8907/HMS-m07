var mongoose = require('mongoose');

var doctor = new mongoose.Schema({
    userName: {type:String, required:true, unique:true},
    password: {type:String, required:true}
});

var User = mongoose.model('HackerUsers',userSchema,'HackerUsers');
module.exports = User;
 

