'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//In this schema we store the data after the registration form has been submitted
var appointmentSchema = new _mongoose2.default.Schema({
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
}); // var mongoose = require('mongoose');


var appointmentN = _mongoose2.default.model('appointment', appointmentSchema, 'appointment');
module.exports = appointmentN;