const Express = require('express');
const router = Express.Router();
const {Movie, validateMovie} = require('../models/Movie');
const {Genre} = require('../models/Genre');


router.get('/', async (req, res) => {
    const movies = await Movie.find();
    if (movies)
        res.status(200).send(movies);
    else
        res.status(202).send('No movies were found');
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.body.id);
    if (!movie)
        return res.status(400).send('Movie with the given id was not found');

    res.status(200).send(movie);
});

router.post('/', async (req, res) => {
   const { error } = validateMovie(req.body);
   if (error)
    return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre)
        return res.status(400).send('Invalid Genre');
    
    const movie = new Movie({
        title: req.body.title,
        genre: {
            genreId: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });

    movie = await movie.save();

    res.send(movie);
});

router.put('/:id', async (req, res) => {
    const { error } = validateMovie(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const movie = await Movie.findById(req.params.id);
    if (!movie)
        return res.status(404).send('Movie with the given id not found');

    if (req.body.genreId){
        const genre = await Genre.findById(req.body.genreId);
        if (!genre)
            return res.status(400).send('Invalid Genre');
    }

    movie.set({
        title: req.body.title,
        genre: {
            genreId: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });

    res.send(movie);

});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);

    if (!movie)
        return res.status(404).send("Movie with the given id was not found");

    res.send(movie);
})
