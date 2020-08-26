const mongoose = require('mongoose');
const schema = mongoose.Schema;

//Schema for Comment requests
const commentRecordsSchema = new schema({
    commentRecordsOf:{
        type:String
    },
    commentRecordsArray:{
        type:Array,
    }
})

module.exports = mongoose.model('CommentRecord', commentRecordsSchema);