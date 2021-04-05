const express = require('express');
const router = express.Router();
const auth = require('./auth');
const otherUserProfileCommentController = require('../controllers/otherUserProfileCommentController');

//to see the comments i post on other users profile
router.post('/comments/:id',auth,otherUserProfileCommentController.commentsPostedByMeOnOthersProfile)

//to see the comments of other users when i visit their profile
router.get('/comments/:id',auth,otherUserProfileCommentController.seeOtherUsersProfileComments)

module.exports = router;