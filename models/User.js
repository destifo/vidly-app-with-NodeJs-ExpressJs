
const mongoose = require('mongoose');
const Joi = require('joi');


const userSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
        minLength: 3, 
        maxLength: 255
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minLength: 5,
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
        maxLength: 1024,
    }
});

const User = mongoose.model(userSchema, 'User');

function validateUser(user) {
    const schema = {
        name: Joi.String().required().minLength(3).maxLength(255),
        email: Joi.String().required().minLength(5).maxLength().email(),
        password: Joi.String().required().minLength(8).maxLength(255),
    };

    return Joi.validate(user, schema);
}


module.exports.User = User;
module.exports.validateUser = validateUser;