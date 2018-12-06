var mongoose = require('mongoose');

var patientSchema = new mongoose.Schema({
    //first visit of the patient should we a reg form and appointment at the same time 
    // if the user wants to book for the second time he has to login
    // he will be only asked the doc
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
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
    address: {
        type: String,
        required: true
    }
    //date displayed on the form but is stored in appointments collection
    //time displayed on the form  but computed based on appointments and doctor collection and stores in appointment collection
    //duration displayed on the form, conputed based on  doc's time and appointment collection and time + duration is stored in appointment collection as eg 7:00 - 7:30.
    //spec displayed on the form doc collection and is stored nowhere we are only using this to get the docname form doc collection
    //doc displayed on the form as mentioned above
    //note displayed on the form but is stored in the appointments table

    // What is stored in appointments table?
    /**
     * with this table we inform patient and the doctor about the apointments and use it to store appointment information
     * 
     * What are the fields in the appointment collection?
     * 
     * patientname:
     * doc name:
     * date:
     * time_alloted:
     * note:
     * 
     * 
     *  
     */
});

var patientN = mongoose.model('patient', patientSchema, 'patient');
module.exports = patientN;