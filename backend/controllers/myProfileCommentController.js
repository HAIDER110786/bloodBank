const Comment = require('../models/comments');
const User = require('../models/users');
const mongoose = require('mongoose');

const newComments = async (req,res)=>{
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
}

const hideComments = async (req,res)=> {
    await Comment.findOneAndUpdate({commentsOf:req.token},{status:'read'});
}

//to post the comments i make on my own profile(Not retrieving them just appending them in the database)
const commentsPostedByMeOnMyOwnProfile = async (req,res)=>{

    //my id : req.token);
    //the comment : req.body.comment

    const myCommentsList = await Comment.findOne({commentsOf:req.token})

    if(myCommentsList) {
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
}

//to see the comments on my own id 
const seeMyProfileComments = async (req, res)=>{
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
}

module.exports = {
    newComments,
    hideComments,
    commentsPostedByMeOnMyOwnProfile,
    seeMyProfileComments
}