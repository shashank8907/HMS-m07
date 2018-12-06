// var mongoose = require('mongoose');
import mongoose from "mongoose";

//In this schema we store the data after the registration form has been submitted
var appointmentSchema = new mongoose.Schema({
    doc_name: {
        type: String,
        required: true
    },
    patient_username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        required: true
    },
    //time slot assigned to the patient based on conditions
    time_slot: {
        type: String,
        required: true
    }
});

var appointmentN = mongoose.model('appointment', appointmentSchema, 'appointment');
module.exports = appointmentN;