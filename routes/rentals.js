
const Express = require('express');
const router = Express.Router();
const {Customer} = require('../models/Customer');
const {Movie} = require('../models/Movie');
const {Rental, validateRental} = require('../models/Rental');
const Fawn = require('fawn');

Fawn.init(mongoose);


router.get('/', async (req, res) => {
    const rentals = await Rental.find();
    if (!rentals)
        return res.status(404).send('No Rental records found');

    res.send(rentals);
});

router.get('/:id', async (req, res) => {
    const rental = await Rental.findById(req.params.id);
    if (!rental)
        return res.status(404).send('Rental with the given not found.');

    res.send(rental);
});

router.post('/', (req, res) => {
    const { error } = validateRental(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const movies = req.body.movies.forEach( async (movieId) => {
        const movie = await Movie.findById(movieId);
        if (!movie)
            return res.status(400).send('Invalid Movie');
        if (movie.numberInStock == 0)
            return res.status(400).send('Movie out of stock');

        return movie;
    });

    const customer = await Customer.findById(req.body.customerId);
    if (!customer)
        return res.status(400).send('Invalid customer');

    const rental = new Movie({
        customer: {
            id: customer._id,
            name: customer.name,
        },
        date: req.body.date,
        payment: req.body.payment,
    });

    for (let movie of movies){
        rental.movies.push({
            id: movie._id,
            title: movie.title,
        });
    }

    let task = new Fawn.Task();
    task.save('Rental', rental);
    for (let movie of movies){
        task.update('Movie', {_id: movie.id}, {
            $inc: {numberInStock: -1}
        });
    }
    task.run()
        .then((results) => {
            console.log(results);
        })
        .catch((err) => {
            console.log(err);
        });

    res.send(rental);
});

router.put('/:id', async (req, res) => {
    const { error } = validateRental(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    let customer;
    if (req.body.customerId){
        customer = await Customer.findById(req.body.customerId);
        if (!customer)
            return res.status(404).send('provided cutomer id is not valid');
    }
    
    let movies = []
    if (req.body.movies.length > 0){
        for (let movieId of req.body.movies){
            const movie = await Movie.findById(movieId);
            if (!movie)
                return res.status(404).send('one of the movies not found');
            
            movies.push(movie);
        }
    }

    const rental = await Rental.findById(req.params.id);
    if (!rental)
        return res.status(404).send("Rental with the given id not found");


    rental.set({
        customer: {
            id: customer._id,
            name: customer.name,
        },
        date: req.body.date,
        payment: req.body.payment,
    });

    for (var movie of movies)
        rental.movies.push(movie);

    const result = await rental.save();
    res.send(result);
});

router.delete('/:id', async (req, res) => {
    const rental = await Rental.findByIdAndRemove(req.params.id);
    if (!rental)
        return res.status(404).send('Rental with the given id not found.');

    res.send(rental);
});