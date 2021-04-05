const joi = require('@hapi/joi');

//Joi Validation Schema for login
const loginValidationSchema = joi.object({
    number: joi.string().length(11).pattern(/^[0-9]+$/).required(),
    password: joi.string().required().min(10).max(100),
});

module.exports = loginValidationSchema;