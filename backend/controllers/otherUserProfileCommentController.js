const Comment = require('../models/comments')
const User = require('../models/users')
const mongoose = require('mongoose');

//to post on other users profile(Not retrieving comments, just adding them to the database)
const commentsPostedByMeOnOthersProfile = async (req,res)=>{

    //my id :req.token
    //the comment : req.body.newComment
    //the person's id whose profile we are visiting : req.params.id);
    
    //HERE WE ENTER THE COMMENT IN THE COMMENT AREA OF THIS SPECIFIC USER
    //This starts here    

    //below, we call the list of the comments on this user's profile
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
}

//to see the comments of other users
const seeOtherUsersProfileComments = async (req, res)=>{
    //retriving the comments array of the user below
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
            i == commentersID.length-1 && res.send(users);
        });
    }
    else{
        return res.send(null);
    }
}

module.exports = {
    commentsPostedByMeOnOthersProfile,
    seeOtherUsersProfileComments,
}