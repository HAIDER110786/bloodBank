const joi = require('@hapi/joi');

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

module.exports = registrationValidationSchema;