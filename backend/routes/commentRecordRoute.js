const express = require('express');
const router = express.Router();
const auth = require('./auth');
const commentRecordController = require('../controllers/commentRecordController');

router.post('/commentRecords/:id',auth, commentRecordController.commentRecord_appendNewCommentToTheCommentRecord)

module.exports = router;