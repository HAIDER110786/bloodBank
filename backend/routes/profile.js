const express = require('express');
const router = express.Router();
const User = require('../models/users');
const auth = require('./auth');
var path = require('path'); 
var multer = require('multer'); 
const fs = require('fs');
const mongoose = require('mongoose');
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

const upload = multer({ storage: storage }); 

router.post('/images',upload.single('file'),async (req,res,next) => { 
    const user = await User.findOne({_id: mongoose.Types.ObjectId(req.body.id)});
    if(user){
        if(user.dp!=='defaultImg.jpg'){
            fs.unlinkSync(`uploads/${user.dp}`); 
        }
        await User.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.id)},{dp:imageFileName});
        return res.json({imageUploaded:true});
    }
});

router.post('/myImage',upload.single('file'),async (req,res,next) => { 
    
    const user = await User.findOne({_id: mongoose.Types.ObjectId(req.body.id)});
    if(user){
        if(user.dp!=='defaultImg.jpg'){
            fs.unlinkSync(`uploads/${user.dp}`); 
        }
        await User.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.body.id)},{dp:imageFileName});
        return res.json({imageUploaded:true});
    }
});

module.exports = router;