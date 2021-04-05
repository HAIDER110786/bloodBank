const User = require('../models/users');
const CommentRecords = require('../models/commentRecords')
const Comment = require('../models/comments')

const commentRecord_appendNewCommentToTheCommentRecord = async (req,res)=>{
    const commenter = await User.findOne({_id:mongoose.Types.ObjectId(req.token)})
    const commentDocumentExists = await CommentRecords.findOne({commentRecordsOf:req.params.id});
    
    await Comment.findOneAndUpdate({commentsOf:req.params.id},{status:'unread'});

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
}

module.exports = {
    commentRecord_appendNewCommentToTheCommentRecord
}
