var express = require('express');
var router = express.Router();
var offer = require('../controllers/OfferController');

router.post('/getoffers', offer.getOffers);
router.post('/create', offer.create);
router.post('/request', offer.request);
module.exports = router;