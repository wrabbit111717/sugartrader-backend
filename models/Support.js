const mongoose = require('mongoose');

const SupportSchema = new mongoose.Schema({
    name : String,
    email : String,
    content : String
});

module.exports = mongoose.model('Support', SupportSchema);