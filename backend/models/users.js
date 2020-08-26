const mongoose = require('mongoose');
const schema = mongoose.Schema; 

//scheme for Users
const userSchema = new schema({
    name:{
        type: String,
        required: true,
        min: 3,
        max: 100,
    },
    age:{
        type: Number,
        required: true,
        min: 18,
        max: 60
    },
    number:{
        type: Number,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    city:{
        type: String,
        required: true,
    },
    blood_group:{
        type: String,
        required: true,
    },
    requirements:{
        type: String,
        required: true,
    },
    dp:{
        type: String,
        default: 'defaultImg.jpg'
    },
    date:{
        type:Date,
        default:Date.now(),
    },
})

module.exports = mongoose.model('User',userSchema);