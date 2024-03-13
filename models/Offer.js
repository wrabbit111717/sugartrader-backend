const mongoose = require('mongoose');

const OfferSchema = new mongoose.Schema({
    type: Number, //0: seller, 1: buyer
    currency: Number, //0: USD, 1: Euro
    spot: Number, 
    amount: Number, 
    contract_date: Date, 
    offertype: String, //0: CIF, 1: FBO
    dest_port: String, //destination port
    warrrenty: String,
    bond: String,
    commission: String,
    product: String,
    language : String,
    title : String,
    category : String,
    email : String,
    content : String,
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model('Offer', OfferSchema);