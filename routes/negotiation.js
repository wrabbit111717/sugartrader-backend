var express = require('express');
var router = express.Router();
var negotiation = require('../controllers/NegotiationController');

router.post('/getNegotiations', negotiation.getNegotiations);
router.post('/getNegotiation', negotiation.getNegotiation);
router.post('/updateNegotiation', negotiation.updateNegotiation);
module.exports = router;