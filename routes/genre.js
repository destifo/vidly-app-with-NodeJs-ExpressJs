const Express = require('express');
const { append } = require('express/lib/response');
const router = Express.Router();
const mongoose = require('mongoose');
const {Genre, validateGenre} = require('../models/Genre');


async function addGenre(genre) {
    const newGenre = new Genre(genre);
    
    try{
        const result = await newGenre.save();
        return result;
    }
    catch(ex){
        console.log(ex.message);
    }
}

async function updateGenre(id, newValue){
    const genre = await Genre.findById(id);
    if (!genre)
        return;

    genre.set(newValue);

    try {
        const result = await genre.save();
        return result;
    }
    catch(ex) {
        console.log(ex.message);
    }
}

async function deleteGenre(id) {
    const result = await Genre.findByIdAndRemove(id);

    return result;
}

async function getGenres() {
    const genres = await Genre.find().select({name: 1}).catch(err => console.log(err.message));
    return genres;
}

async function getGenre(id){
    const genre = await Genre.findById(id);

    return genre;
}

router.get('/', async (req, res) => {
    const genres = await getGenres();
    res.send(genres);
});

router.get('/:id', async (req, res) => {
    const genre = await getGenre(req.params.id); 
    if (!genre) return res.status(404).send("Genre with given id no t found");
    return res.send(genre);
});

router.post('/', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newGenre = {
        name: req.body.name
    };
    const result = await addGenre(newGenre); 

    res.send(result);
});

router.put('/:id', async (req, res) => {
    const { error } = validateGenre(req.body);
    if (error)  return res.status(400).send(error.details[0].message);

    const genre = await updateGenre(req.params.id, {
        name: req.body.name,
    });

    if (!genre) return res.status(404).send("Genre with the given id not found");

    res.status(200).send(genre);
});

router.delete('/:id', async (req, res) => {
    const genre = await deleteGenre(req.params.id);

    if (!genre) return res.status(404).send("Genre with the given id was not found");

    res.send(genre);    
});


module.exports = router;