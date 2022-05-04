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

const Genre = mongoose.model('Genres', genreSchema);

function validateGenre(genre){
    const schema = {
        name: Joi.string().min(2).required(),
        
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.validateGenre = validateGenre;
exports.genereSchema = genreSchema