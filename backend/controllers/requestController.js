const User = require('../models/users');
const Request = require('../models/requests');

const request_newRequests = async (req,res)=>{
    const newRequests = await Request.find({to:req.token})
    if(newRequests.length>0){
        const unreadRequest = newRequests.some(newRequest =>{
            return newRequest.status==="unread";
        })
        if(unreadRequest){
            return res.json({request:true});
        }else{
            return res.json({request:false});
        }
    }else{
        return res.json({request:false});
    }
}

const request_hideRequests = async (req,res)=>{
    const unreadRequests = await Request.find({to:req.token});
    unreadRequests.forEach(async unreadRequest=>{
        await Request.findOneAndUpdate
        ({_id:mongoose.Types.ObjectId(unreadRequest._id)},{status:"read"});
    })
}

const request_mutualRequests =  async (req,res)=>{
    //the user's profile i am currently in 
    const {id} = req.params;
    //my profile
    const {token} = req;

    const all_requested_by_me = await Request.find({from:token});
    if(all_requested_by_me){
        const requested_by_me_to_the_current_user = all_requested_by_me.some(u=>{
            return u.to==id;
        })
        if(requested_by_me_to_the_current_user){
            return res.json({requested:true});
        }else{
            return res.json({requested:false});
        }
    }else{
        return res.json({requested:false});
    }
}

const request_postRequests = async (req,res) => {

    // from TYPE:object
    // console.log('the requester send to is ' + req.body.from._id);
    // to TYPE:string
    // console.log('the requester maker is '+ req.token);

    const existing_requests_by_the_requester = await Request.find({from:req.token});
    const request_exists = existing_requests_by_the_requester.some(currentRequest => {
        return currentRequest.to === req.body.from._id;
    })
    if(request_exists === true){
        return res.json({status:'already requested'});
    }
    else{
        const request = new Request({
            to:req.body.from._id,
            from:req.token
        });

        try {
            await request.save();
            return res.json({status:'request sent'});
        } catch (error) {
            return res.status(500).send(err);   
        }
    }
}

const request_deleteRequests = (req,res) => {
    Request.findByIdAndDelete({_id:req.params.id})
    .then(user => {
        return res.send({data:user,status:'deleted'});
    });
}

const request_getBloodRequestNotification = async (req,res) => {
    let userList = [];

    //below gives the id of the users(if any) who made the requests
    const inComingRequests = await Request.find({to:req.token});
    
    //return nothing if no notifications are present
    inComingRequests.length === 0 && res.send(inComingRequests);    

    //below returns all the users
    inComingRequests.forEach(async (requestFrom,index) => {
        const users = await User.find({_id:mongoose.Types.ObjectId(requestFrom.from)});

        //we have to put a square bracket here because User.find returns an array
        //even if the length is one, if you dont want the use square brackets then
        //use findOne instead of find
        userList.push({_id:requestFrom._id,name:users[0].name,dp:users[0].dp});

        //return only on the last iteration, so that all the data is collected by the 
        //then block on the frontend 
        index === inComingRequests.length-1 && res.send(userList);
    });
}

module.exports = {
    request_newRequests,
    request_hideRequests,
    request_mutualRequests,
    request_postRequests,
    request_deleteRequests,
    request_getBloodRequestNotification,
}