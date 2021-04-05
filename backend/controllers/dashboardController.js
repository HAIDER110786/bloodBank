const User = require('../models/users');

const dashboard_getUsers = async (req,res) => {
    const _id = req.token;

    const allUsers = await User.find({},(err)=>{
        if(err)res.status(500).send(err);
    });

    const allUsersExpectForTheCurrentOne = allUsers.filter(user =>  user._id != _id)

    res.send(allUsersExpectForTheCurrentOne);
}

module.exports = {
    dashboard_getUsers
}