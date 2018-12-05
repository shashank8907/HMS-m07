var mongoose = require("mongoose");
mongoose.set('debug', true)
mongoose.connect('mongodb://localhost/nightout',{ useNewUrlParser: true });
mongoose.Promise = Promise

var DoctorSchema = new mongoose.Schema({
     user_id :String,
     name:String,
     specialiation: String,
     content:String,
     updated_at :Date
});

var Doctor = mongoose.model('Doctor',DoctorSchema);
module.exports = Doctor;

