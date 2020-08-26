const mongoose = require('mongoose');
const schema = mongoose.Schema;

//Schema for records
const recordSchema = new schema({
    recordsOf:{
        type:String
    },
    recordsArray:{
        type:Array,
    }
})

module.exports = mongoose.model('Record', recordSchema);