const express = require('express');
const router = express.Router();
const auth = require('./auth');
const profileController = require('../controllers/profileController')

//to change my DP
router.post('/profile/images',auth,profileController.changeDP);

module.exports = router;