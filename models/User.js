const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    language : String,
    name : String,
    email : String,
    phone : String,
    password : String,
    address: String,
    company: String,
    agent: String,
    transaction: String,
    passport: String,
    created_at : Date,
    permission : Number,
    verificationToken: String,
    isVerified: { type: Boolean, default: false },
    updated_at: Date
});


module.exports = mongoose.model('User', UserSchema);