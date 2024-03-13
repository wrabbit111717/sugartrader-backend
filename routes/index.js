var express = require('express');
var router = express.Router();
var user = require('../controllers/UserController');
var admin = require('../controllers/AdminController');
var post = require('../controllers/PostController');
var auth_middleware = require('../middlewares/auth');
var admin_middleware = require('../middlewares/admin');
var share = require('../controllers/ShareController');

/** User Router */

module.exports = router;
