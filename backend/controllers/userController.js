const User = require('../models/users');

const user_userData = async (req,res) => {
    const userData = await User.findOne({_id:req.params.userId});
    res.send(userData);
}

module.exports = {
    user_userData
}