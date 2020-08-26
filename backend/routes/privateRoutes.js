const express = require('express');
const router = express.Router();
const auth = require('./auth');
const User = require('../models/users');
const Request = require('../models/requests');
const mongoose = require('mongoose');
const Record = require('../models/records');
const CommentRecords = require('../models/commentRecords');
const Comment = require('../models/comments');

router.get('/newRequest',auth,async (req,res)=>{
    const newRequests = await Request.find({to:req.token})
    if(newRequests.length>0){
        const unreadRequest = newRequests.some(newRequest =>{
            return newRequest.status==="unread";
        })
        if(unreadRequest){
            return res.json({request:true});
        }else{
            return res.json({request:false});
        }
    }else{
        return res.json({request:false});
    }
})

router.post('/hideRequests',auth,async (req,res)=>{
    const unreadRequests = await Request.find({to:req.token});
    unreadRequests.forEach(async unreadRequest=>{
        await Request.findOneAndUpdate
        ({_id:mongoose.Types.ObjectId(unreadRequest._id)},{status:"read"});
    })
})

router.get('/newComment',auth,async (req,res)=>{
    const newComment = await Comment.findOne({commentsOf:req.token})
    if(newComment){
        if(newComment.status=='unread'){
            return res.json({msg:true});
        }
        else{
            return res.json({msg:false});
        }
    }else{
        return res.json({msg:false});
    }
})

router.post('/hideComments',auth,async (req,res)=>{
    await Comment.findOneAndUpdate({commentsOf:req.token},{status:'read'});
})

router.get('/mutualRequests/:id', auth, async (req,res)=>{
    //the user's profile i am currently in 
    const {id} = req.params;
    //my profile
    const {token} = req;

    const all_requested_by_me = await Request.find({from:token});
    if(all_requested_by_me){
        const requested_by_me_to_the_current_user = all_requested_by_me.some(u=>{
            return u.to==id;
        })
        if(requested_by_me_to_the_current_user){
            return res.json({requested:true});
        }else{
            return res.json({requested:false});
        }
    }else{
        return res.json({requested:false});
    }
})

router.get('/dashboard',auth,async (req,res) => {
    const _id = req.token;

    const allUsers = await User.find({},(err)=>{
        if(err)res.status(500).send(err);
    });

    const allUsersExpectForTheCurrentOne = allUsers.filter(user =>  user._id != _id)

    res.send(allUsersExpectForTheCurrentOne);
})

router.post('/user',auth,async (req,res) => {
    const userData = await User.findOne({_id:req.body.id});
    res.send(userData);
})

router.post('/requests',auth,async (req,res) => {

    // from TYPE:object
    // console.log('the requester send to is ' + req.body.from._id);
    // to TYPE:string
    // console.log('the requester maker is '+ req.token);

    const existing_requests_by_the_requester = await Request.find({from:req.token});
    const request_exists = existing_requests_by_the_requester.some(currentRequest => {
        return currentRequest.to === req.body.from._id;
    })
    if(request_exists === true){
        return res.json({status:'already requested'});
    }
    else{
        const request = new Request({
            to:req.body.from._id,
            from:req.token
        });

        try {
            await request.save();
            return res.json({status:'request sent'});
        } catch (error) {
            return res.status(500).send(err);   
        }
    }
})

router.get('/notifications',auth,async (req,res) => {
    let userList = [];

    //below gives the id of the users who made the requests
    const inComingRequests = await Request.find({to:req.token});
    
    //return nothing if no notifications are present
    if(inComingRequests.length===0){
        return res.send(inComingRequests);
    }

    //below returns all the users 
    inComingRequests.forEach(async (requestFrom,index) => {
        const users = await User.find({_id:mongoose.Types.ObjectId(requestFrom.from)});

        //we have to put a square bracket here because User.find returns an array
        //even if the length is one, if you dont want the use square brackets then
        //use findOne instead of find
        userList.push({_id:requestFrom._id,name:users[0].name,dp:users[0].dp});

        //return only on the last iteration, so that all the data is collected by the 
        //then block 
        if(index === inComingRequests.length-1)
            return res.send(userList);
    });
});


router.get('/myProfile',auth,async (req,res) => {
    const me = await User.find({_id:req.token});
    res.send(me);
})

router.delete('/requests/:id',(req,res) => {
    Request.findByIdAndDelete({_id:req.params.id})
    .then(user => {
        return res.send({data:user,status:'deleted'});
    });
})

router.post('/records/:response',auth,async (req,res) => {
    const {token} = req;
    const {response} = req.params;
    const {date,requester,requestee} = req.body;

    const record = await Record.findOne({recordsOf:token});
    const newRecord = `${requestee} ${response} ${requester}'s blood request on ${date}`;

    if(record){
        const appendedToTheSpecificRecord = await Record.findOneAndUpdate({recordsOf:token},{$push:{recordsArray:newRecord}});
        res.send(appendedToTheSpecificRecord);
    }
    else{
        const recordInstance = new Record({
            recordsOf:token,
            recordsArray:[newRecord]
        });

        try{
            const savedRecord = await recordInstance.save();
            res.send(savedRecord);
        }
        catch(e){
            res.status(500).send(e);
        }
    }
})

//to see the records of other users
router.get('/records/:id',auth,(req,res)=>{
    const {id} = req.params;
    Record.findOne({recordsOf:id}).then(records => res.send(records)).catch(err => res.status(400).send(err));
})

//to get my records 
router.get('/records',auth,(req,res)=>{
    const {token} = req;
    Record.findOne({recordsOf:token}).then(records => res.send(records)).catch(err => res.status(400).send(err));
})

router.post('/commentRecords/:id',auth,async (req,res)=>{
    const commenter = await User.findOne({_id:mongoose.Types.ObjectId(req.token)})
    const commentDocumentExists = await CommentRecords.findOne({commentRecordsOf:req.params.id});
    
    await Comment.findOneAndUpdate({commentsOf:req.params.id},{status:'unread'});
    // console.log(commentDocumentExists);
    // console.log(`${commentee.name}`);
    // console.log(`${commenter.name} commented on your profile`);
    if(!commentDocumentExists){
        const CommentsNotification = new CommentRecords({       
            commentRecordsOf:req.params.id,
            commentRecordsArray:[`${commenter.name} commented on your profile`]
        })
        try {
            await CommentsNotification.save();
            return res.send({status:'notification added'});   
        } catch (error) {
            return res.status(500).send(error);
        }
    }else{
        const CommentRecordsOfFinder = await CommentRecords.findOneAndUpdate({commentRecordsOf:req.params.id},{$push:{commentRecordsArray:`${commenter.name} commented on your profile`}});
        if(CommentRecordsOfFinder){
            return res.send({status:'notification added'});  
        }
        else{
            return res.status(500).send('problem in making the database entry');
        }
    }
    //POSTING COMMENTS ENDS HERE
})


//to see the comments i post on other users profile
router.post('/comments/:id',auth,async (req,res)=>{

    //my id 
    // console.log('my id '+req.token);
    
    //the comment
    // console.log('the comment '+req.body.newComment);
    
    //the person's id whose profile we are visiting 
    // console.log("the person's id i am commenting on "+req.params.id);
    
    
    //HERE WE ENTER THE COMMENT IN THE COMMENT AREA OF THIS SPECIFIC USER
    //This starts here    
    const commentsForAUser = await Comment.findOne({commentsOf:req.params.id})
    
    if(commentsForAUser) {
        const newComment = {
            Commentsfrom:req.token,
            comment:req.body.newComment
        }
        const CommentOfFINDER = await Comment.findOneAndUpdate({commentsOf:req.params.id},{$push:{commentDetails:newComment}});
        if(CommentOfFINDER){
            return res.json({done:'comment added'});
        }
        else {
            return res.status(500).send('Error in added the comment to the document');
        }
    }
    else
    {
        const comment = new Comment({
            commentsOf:req.params.id,
            commentDetails:[{
                Commentsfrom:req.token,
                comment:req.body.newComment
            }]
        });

        try {
            await comment.save();
            return res.json({done:'document created and comment added'});
        } catch (error) {
            return res.status(500).send(error);
        }
    }
})


//to post the comments i make on my own profile
router.post('/comments',auth,async (req,res)=>{

    //my id 
    // console.log('my id '+req.token);

    // //the comment
    // console.log('the comment '+req.body.comment);

    const commentsForAUser = await Comment.findOne({commentsOf:req.token})

    if(commentsForAUser) {
        const newComment = {
            Commentsfrom:req.token,
            comment:req.body.comment
        }
        const CommentOfFINDER = await Comment.findOneAndUpdate({commentsOf:req.token},{$push:{commentDetails:newComment}});
        res.send(CommentOfFINDER);
    }
    else
    {
        const comment = new Comment({
            commentsOf:req.token,
            commentDetails:[{
                Commentsfrom:req.token,
                comment:req.body.comment
            }]
        });

        try {
            const savedComment = await comment.save();
            res.send(savedComment);
        } catch (error) {
            res.status(500).send(error);
        }
    }
})

//to see the comments of other users
router.get('/comments/:id', async (req, res)=>{
    const theirComments = await Comment.findOne({commentsOf:req.params.id});
    if(theirComments){
        const commentersID = await theirComments.commentDetails.map(commenterID => {
            return {commenterID:commenterID.Commentsfrom,commenterComment:commenterID.comment};
        })
        let users=[];
        commentersID.forEach(async (userFromId,i) => {
            const user = await User.findOne({_id:mongoose.Types.ObjectId(userFromId.commenterID)});
            const userWithRespectiveComment = {...user._doc,comment:userFromId.commenterComment}
            users.push(userWithRespectiveComment);
            if(i==commentersID.length-1) return res.send(users);
        });
    }
    else{
        return res.send(null);
    }
})

//to see the comments on my own id 
router.get('/comments',auth,async (req, res)=>{
    const myComments = await Comment.findOne({commentsOf:req.token});
    if(myComments){
        const commentersID = await myComments.commentDetails.map(commenterID => {
            return {commenterID:commenterID.Commentsfrom,commenterComment:commenterID.comment};
        })
        let users=[];
        commentersID.forEach(async (userFromId,i) => {
            const user = await User.findOne({_id:mongoose.Types.ObjectId(userFromId.commenterID)});
            const userWithRespectiveComment = {...user._doc,comment:userFromId.commenterComment}
            users.push(userWithRespectiveComment);
            if(i==commentersID.length-1) return res.send(users);
        });
    }
    else{
        return res.send([]);
    }
})

router.use('/profile',require('./profile'));

module.exports = router;


//https://youtu.be/8pOuftKw8I0