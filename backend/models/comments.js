const mongoose = require('mongoose');
const schema = mongoose.Schema;

//inner nested comments schema
const innerComments = new schema({
    Commentsfrom:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    },
})

//Schema for comments
const commentSchema = new schema({
    commentsOf:{
        type:String,
        required:true
    },
    commentDetails:[innerComments],
    status:{
        type:String,
        default:'unread'
    }
})

module.exports = mongoose.model('Comment',commentSchema);