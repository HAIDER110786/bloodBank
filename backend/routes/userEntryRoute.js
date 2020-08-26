const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const joi = require('@hapi/joi');
const privateRoutes = require('./privateRoutes');



//Joi Validation Schema for registration
const registrationValidationSchema = joi.object({ 
    name: joi.string().required().min(3).max(100).trim(),
    age: joi.number().required().min(15).max(60),
    number: joi.string().length(11).pattern(/^[0-9]+$/).required(),
    password: joi.string().required().min(10).max(100),
    city: joi.string().required().min(3).max(40),
    blood_group: joi.string().required(),
    requirements: joi.string().required(),
 });

 //Joi Validation Schema for login
 const loginValidationSchema = joi.object({
     number: joi.string().length(11).pattern(/^[0-9]+$/).required(),
     password: joi.string().required().min(10).max(100),
  });

//handle register route
router.post('/register', async (req,res)=>{

    //Validate the user input
    const {error} = registrationValidationSchema.validate(req.body);
    if(error) return res.json({denied:error.details[0].message});

    const numberInString = (req.body.number).toString();
    let element = '';
    let element1;
    //removing the first zero from number
    for (let index = 1; index < numberInString.length; index++) {
        element = element + numberInString[index];
    }

    element1 = parseInt(element);

    // Check for duplicate number
    const numberExists = await User.findOne({number:element1});
    if(numberExists){
        res.json({denied:'The Number is already in use please, try again with an other number'});
    }

    else{
        const user = new User({
            name: req.body.name,
            age: req.body.age,
            number: req.body.number,
            password: req.body.password,
            city: req.body.city,
            blood_group: req.body.blood_group,
            requirements: req.body.requirements,
        });

        try
        {
            const savedUser = await user.save();  
            return res.json({approved:'You have been successfully registered'});
        }
        catch(err)
        {
            return res.status(500).send(err);
        }
    }

})

//handle login route
router.post('/login', async (req,res)=>{

    //validate for the user login data 
    const {error} = loginValidationSchema.validate(req.body);
    if(error){ 
        return res.json({denied:error.details[0].message});
    }
    
    else{


        //check if the number exists
        const userData = await User.findOne({number:req.body.number});

        if(!userData){
            return res.json({denied:'The Number you entered is not registered'});
        }
        else{
            //check for the corresponding password for the found number
            const correctPassword = userData.password === req.body.password;
            if(!correctPassword){
                return res.json({denied:'Incorrect password'});
            }
            else{
            //send the json web token to the user
                const token = jwt.sign({_id:userData._id},process.env.passWord);
                return res.header('auth-token',token).send(token);
            }
        }
    }   

})

router.use(privateRoutes);



module.exports = router;