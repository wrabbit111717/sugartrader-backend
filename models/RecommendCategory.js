const mongoose = require('mongoose');

const RecommendCategorySchema = new mongoose.Schema({
    category : String,
    email : String,
    content : String
});

module.exports = mongoose.model('RecommendCategory', RecommendCategorySchema);