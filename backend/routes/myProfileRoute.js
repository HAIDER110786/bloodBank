const express = require('express');
const router = express.Router();
const auth = require('./auth');
const myProfileController = require('../controllers/myProfileController')

router.get('/myProfile',auth, myProfileController.myProfile_getMyProfileData)

module.exports = router;