const express = require('express');
const router = express.Router();
const auth = require('./auth');
const recordController = require('../controllers/recordController')

router.post('/records/:response',auth, recordController.record_addMyResponseToMyRecordsList)

router.get('/records/:id',auth, recordController.record_seeOtherUsersRecordsList)

router.get('/records',auth, recordController.record_getMyRecordsList)

module.exports = router;