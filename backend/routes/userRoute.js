const express = require('express');
const router = express.Router();
const auth = require('./auth');
const userController = require('../controllers/userController') 

router.get('/user/:userId',auth, userController.user_userData)

module.exports = router;
