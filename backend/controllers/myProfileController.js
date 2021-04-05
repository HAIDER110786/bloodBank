const User = require('../models/users');

const myProfile_getMyProfileData = async (req,res) => {
    const myProfileData = await User.find({_id:req.token});
    res.send(myProfileData);
}

module.exports = {
    myProfile_getMyProfileData
}