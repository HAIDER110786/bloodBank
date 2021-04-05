const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoute');
const requestRoutes = require('./requestRoute');
const myProfileCommentRoutes = require('./myProfileCommentRoute');
const dashboardRoutes = require('./dashboardRoute');
const userRoutes = require('./userRoute');
const myProfileRoutes = require('./myProfileRoute');
const recordRoutes = require('./recordRoute');
const commentRecordRoutes = require('./commentRecordRoute');
const otherUserProfileCommentRoutes = require('./otherUserProfileCommentRoute');
const profileRoutes = require('./profileRoute');

router.use(authRoutes);

router.use(requestRoutes);

router.use(myProfileCommentRoutes);

router.use(dashboardRoutes);

router.use(userRoutes);

router.use(myProfileRoutes);

router.use(recordRoutes);

router.use(commentRecordRoutes);

router.use(otherUserProfileCommentRoutes)

router.use(profileRoutes)

module.exports = router;