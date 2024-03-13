const Negotiation = require('../models/Negotiation');
const Offer = require('../models/Offer');
const User = require('../models/User');

exports.getOffers = async function(req, res, next) {
    const {type, user_id} = req.body;
    console.log(user_id, 'user_id')
    try {
        Offer.find({type : type, user_id: { $ne: user_id }}, (err, offers) => {
            res.json({offers : offers});
        });    
    } catch (err) {
        console.error('Get Offers error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}

exports.create = async function (req, res, next) {
    try {
        const type = req.body.type;
        const amount = req.body.amount;
        const email = req.body.email;
        const offer_type = req.body.offer_type;
        const contract_date = req.body.contract_date;
        const spot = req.body.spot;
        const dest_port =req.body.dest_port;
        const user_id =req.body.user_id;

        // Create a new user
        const newOffer = new Offer({
            type: type,
            amount: amount,
            email: email,
            offertype: offer_type,
            contract_date: contract_date,
            spot: spot,
            dest_port: dest_port,
            user_id: user_id
        });

        // Save the user to the database
        await newOffer.save();

        // Return a success response
        return res.status(200).json({ message: 'Offer created successfully.', status: 200 });

    } catch (error) {
        console.error('Create error:', error);
        return res.status(500).json({ error: error, status: 500 });
    }
};

exports.request = async function(req, res, next) {
    const {offer_id, user_id} = req.body;
    try {
        const offer = await Offer.findOne({ _id: offer_id });
        const seller_id = user_id;
        const buyer_id = offer.user_id;
        const newNegotiation = new Negotiation({
            offer_id: offer_id,
            stage: 0,
        });
        if(offer.type === 0) {
            newNegotiation.buyer_id = buyer_id;
            newNegotiation.seller_id = seller_id;
        } else {
            newNegotiation.buyer_id = seller_id;
            newNegotiation.seller_id = buyer_id;
        }
        await newNegotiation.save();
        return res.status(200).json({ message: 'Offer requested successfully.', status: 200 });
    } catch (err) {
        console.error('Get Offers error:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}