const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = mongoose.Schema({
    isGold: {type: Boolean, default: false},
    name: {
        type: String,
        required: true,
        min: 3,
        max: 40,
    },
    phone: {
        type: String,
        required: true,
        min: 5,
        max: 10
    }
});

function validateCustomer(customer) {
    const schema = {
        isGold: Joi.Boolean(),
        name: Joi.String().min(2).max(40).required(),
        phone: Joi.String().min(5).max(10).required(),
    }
    
    return Joi.validate(customer, schema);
}

const Customer = mongoose.model("Customer", customerSchema);

module.exports.Customer = Customer;
module.exports.validateCustomer = validateCustomer;
module.exports.customerSchema = customerSchema;