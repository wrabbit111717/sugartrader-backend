const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    category_id : String,
    category : String,
    language : String,
    industry : String,
    title : String,
    content : String,
    poster : String,
    poster_id : String,
    poster_email : String,
    poster_phone : String,
    shared : Number,
    created_at : Date,
    image : String
});

module.exports = mongoose.model('Post', PostSchema);