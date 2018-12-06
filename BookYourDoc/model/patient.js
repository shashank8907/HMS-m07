var mongoose = require('mongoose');

var patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phno: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    spec: {
        type: String,
        required: true
    },
    doc: {
        type: String,
        required: true
    },

    address: {
        type: String,
        required: true
    },
    note: {
        type: String,
        required: true
    },
    allotted_time: {
        type: String,
        required: true
    }

});

var patientNjs = mongoose.model('patient', patientSchema, 'patient');
module.exports = patientNjs;