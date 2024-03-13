const mongoose = require('mongoose');

const IndustrySchema = new mongoose.Schema({
    name : String,
})

module.exports = mongoose.model('Industry', IndustrySchema);