const jwt = require('jsonwebtoken');
const User = require('../models/users');
const loginValidationSchema = require('../validationSchemas/loginValidation')
const registrationValidationSchema = require('../validationSchemas/registrationValidation')

const auth_register = async(req,res) => {

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
}


const auth_login = async (req,res)=>{

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
}

module.exports = {
    auth_login,
    auth_register,
}