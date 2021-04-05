const User = require('../models/users');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
let imageFileName = '';

const storage = multer.diskStorage({ 
    destination: (req, file, cb) => { 
        cb(null, 'uploads/') 
    }, 
    filename: (req, file, cb) => { 
        imageFileName = '';
        imageFileName = file.fieldname + '-' + Date.now() + (path.extname(file.originalname)).toLowerCase();
        cb(null,imageFileName); 
    }
});

const changeDP = (req,res) => {

    const upload = multer({ storage : storage}).single('file');

    upload(req,res,async e=>{
        if(e) return res.status(400).send('error in uploading the image');
        const user = await User.findOne({_id: mongoose.Types.ObjectId(req.body.id)});
        if(user){
            if(user.dp!=='defaultImg.jpg'){
                fs.unlinkSync(`uploads/${user.dp}`);
            }
            await User.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.id)},{dp:imageFileName});
            return res.json({imageUploaded:true});
        }
    })
}

module.exports = {
    changeDP
}