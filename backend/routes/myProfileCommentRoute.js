const express = require('express');
const router = express.Router();
const auth = require('./auth');
const myProfileCommentController = require('../controllers/myProfileCommentController')

router.get('/newComment',auth, myProfileCommentController.newComments)

router.post('/hideComments',auth, myProfileCommentController.hideComments)

//to post the comments i make on my own profile
router.post('/comments',auth,myProfileCommentController.commentsPostedByMeOnMyOwnProfile)

//to see the comments on my own id when open my profile
router.get('/comments',auth,myProfileCommentController.seeMyProfileComments)

module.exports = router;