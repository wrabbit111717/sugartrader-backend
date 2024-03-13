const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    language : String,
    name : String,
})

module.exports = mongoose.model('Category', CategorySchema);