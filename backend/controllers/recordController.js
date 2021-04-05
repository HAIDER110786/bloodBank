const Record = require('../models/records')

//adding my response(accept or deny) to the blood request in my records list
const record_addMyResponseToMyRecordsList = async (req,res) => {
    const {token} = req;
    const {response} = req.params;
    const {date,requester,requestee} = req.body;

    const record = await Record.findOne({recordsOf:token});
    const newRecord = `${requestee} ${response} ${requester}'s blood request on ${date}`;

    if(record){
        const appendedToTheSpecificRecord = await Record.findOneAndUpdate({recordsOf:token},{$push:{recordsArray:newRecord}});
        res.send(appendedToTheSpecificRecord);
    }
    else{
        const recordInstance = new Record({
            recordsOf:token,
            recordsArray:[newRecord]
        });

        try{
            const savedRecord = await recordInstance.save();
            res.send(savedRecord);
        }
        catch(e){
            res.status(500).send(e);
        }
    }
}

//to see the records of other users
const record_seeOtherUsersRecordsList = (req,res) => {
    const {id} = req.params;
    Record
    .findOne({recordsOf:id})
    .then(records => res.send(records))
    .catch(err => res.status(400).send(err));
};

//to get my updated records 
const record_getMyRecordsList = (req,res) => {
    const {token} = req;
    Record
    .findOne({recordsOf:token})
    .then(records => res.send(records))
    .catch(err => res.status(400).send(err));
}

module.exports = {
    record_addMyResponseToMyRecordsList,
    record_seeOtherUsersRecordsList,
    record_getMyRecordsList,
}