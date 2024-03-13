const mongoose = require('mongoose');

const FaqSchema = new mongoose.Schema({
    language : String,
    title : String,
    category : String,
    email : String,
    content : String
});

module.exports = mongoose.model('Faq', FaqSchema);