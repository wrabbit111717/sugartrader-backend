const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema({
    language : String,
    title : String,
    type : String,
    page_type : String,
    description : String,
    url : String
});

module.exports = mongoose.model('Training', TrainingSchema);