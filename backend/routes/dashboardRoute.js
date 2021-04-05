const express = require('express');
const router = express.Router();
const auth = require('./auth');
const dashboardController = require('../controllers/dashboardController') 

router.get('/dashboard',auth, dashboardController.dashboard_getUsers)

module.exports = router;