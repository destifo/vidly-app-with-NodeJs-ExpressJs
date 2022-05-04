
const Joi = require('joi');
const mongoose = require('mongoose');
const { movieSchema } = require('./Movie');
const { customerSchema } = require('./Customer');


const rentalSchema = mongoose.Schema({
    customer: {
        type: customerSchema,
        required: true,
    },
    movies: {
        type: [movieSchema],
        required: true,
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dateReturned: {
        type:Date,
    },
    payment: {
        type: Number,
        required: true,
        min: 5,
        max: 25,
    }
});

const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental) {
    const schema = {
        customerId: Joi.String().required(),
        movies: Joi.array().items(Joi.String()).required(),
        dateOut: Joi.Date().required(),
        dateReturned: Joi.Date().required(),
        payment: Joi.Number().min(5).max(25).required(),
    }

    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validateRental = validateRental;
exports.rentalSchema = rentalSchema;