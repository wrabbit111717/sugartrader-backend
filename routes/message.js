var express = require('express');
var router = express.Router();
var message = require('../controllers/MessageController');

router.get('/:fileName', message.fileDownload);

// Define route to handle retrieving chat history
router.get('/messages', message.getMessage);

module.exports = router;