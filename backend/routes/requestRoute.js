const express = require('express');
const router = express.Router();
const auth = require('./auth');
const requestController = require('../controllers/requestController');

router.get('/newRequest',auth,requestController.request_newRequests);

router.post('/hideRequests',auth,requestController.request_hideRequests);

router.get('/mutualRequests/:id', auth, requestController.request_mutualRequests)

router.post('/requests',auth, requestController.request_postRequests)

router.delete('/requests/:id', requestController.request_deleteRequests)

router.get('/bloodRequestNotification',auth, requestController.request_getBloodRequestNotification);

module.exports = router;