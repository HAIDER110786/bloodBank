const mongoose = require('mongoose');
const schema = mongoose.Schema;

//Schema for Images
const reqSchema = new schema({
    from:{
        type: Object
    },
    to:{
        type: String
    },
    status:{
     type:String,
     default:'unread'
    }
});

module.exports = mongoose.model('Request',reqSchema);