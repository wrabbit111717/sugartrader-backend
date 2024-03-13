const mongoose = require('mongoose');

const negotiationSchema = new mongoose.Schema({
    buyer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    seller_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    offer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer', // Reference to the Offer model
        required: true
    },
    dueDate: {
        type: Date,
    },
    stage: {
        type: Number,
        default: 0,
        required: true
    },
    status: {
        type: Boolean,
        default: false,
        required: true
    },
    doc: {
        type: String // Assuming it's some document related to negotiation
    }
});

const Negotiation = mongoose.model('Negotiation', negotiationSchema);

module.exports = Negotiation;
