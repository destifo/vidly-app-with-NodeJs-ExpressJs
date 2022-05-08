const mongoose = require('mongoose');
const Joi = require('joi');


const genreSchema = mongoose.Schema({
    name: { 
        type: String,
        min: 2,
        required: true,
        uppercase: true,
    }
});

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 5,
        maxLength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number, 
        required: true,
        min: 0,
        max: 255,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    }
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovie(movie) {
    const schema = {
        title: Joi.String().required().min(0).max(255),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.Number().required().min(0).max(255),
        dailyRentalRate: Joi.Number().required().min(0).max(255),
    };

    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;
exports.movieSchema = movieSchema;