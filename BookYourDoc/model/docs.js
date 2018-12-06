var mongoose = require('mongoose');

var doctorSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    user_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    spec: {
        type: String,
        required: true
    },
    about: {
        type: String,
        required: true
    },
    at_hospital: {
        type: String,
        required: true
    }

});








var doctorN = mongoose.model('doctor', doctorSchema, 'doctor');
module.exports = doctorN;