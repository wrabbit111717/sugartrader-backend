const Negotiation = require('../models/Negotiation');
const Offer = require('../models/Offer');
const User = require('../models/User');

exports.getNegotiations = async function(req, res, next) {
    const {user_id} = req.body;
    Negotiation.find({   $or: [
        { buyer_id: user_id },
        { seller_id: user_id }
      ] })
    .populate('offer_id') // Populate the 'offerId' field in the NegotiationSchema
    .exec((err, negotiations) => {
        if (err) {
            console.error('Error fetching negotiations:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ negotiations: negotiations });
        }
    });
}

exports.getNegotiation = async function(req, res, next) {
    const {negotiationId} = req.body;
    try {
        const negotiation = await Negotiation.findById(negotiationId)
        .populate('buyer_id') // Populate Buyer fields (username and email)
        .populate('seller_id');
        console.log(negotiation, 'negotiation')
        if (negotiation) {
            console.log(negotiation, negotiationId)
            res.json({ negotiation: negotiation });
        }

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

exports.updateNegotiation = async function(req, res, next) {
    const {stage, negotiationId, status} = req.body;
    try {
        // Find the negotiation record by ID and update its stage
        const updatedNegotiation = await Negotiation.findOneAndUpdate(
            { _id: negotiationId }, // Query: find record by ID
            { stage: status ? stage + 1 : stage, status: true }, // New data: update stage field only
            { new: true } // Options: return the modified document after update
        );

        if (!updatedNegotiation) {
            // Handle case where negotiation with given ID is not found
            throw new Error('Negotiation not found');
        }

        // Return the updated negotiation record
        res.json({ negotiation: updatedNegotiation });

    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error });
    }
}
