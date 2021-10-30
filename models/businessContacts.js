/**
 * @author Marc Adrian Dominguez
 * @studentID 301151879
 * @description Personal Portfolio
 */


let mongoose = require('mongoose');

// create a model class
let businessContactsSchema = mongoose.Schema({
        contactName: String,
        contactNumber: String,
        email: String,
    },
    {
        collection: "businessContacts"
    });

module.exports = mongoose.model('businessContacts', businessContactsSchema);
