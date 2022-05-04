const Express = require('express');
const { append } = require('express/lib/response');
const genres = require('./routes/genre');
const customers = require('./routes/customers');
const rentals = require('./routes/rentals');
const movies = require('./routes/movies');

const app = Express();
const morgan = require('morgan');
const helmet = require('helmet');
const debug = require('debug')('app:startup');
const mongoose = require('mongoose');
const { required } = require('joi/lib/types/lazy');

mongoose.connect("mongodb://localhost/vidly").then(() => console.log("Connected to MongoDb...")).catch(err => console.error("Connection to MongoDb was unsuccessful"));

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }))
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/rentals', rentals);
app.use('/api/movies', movies);

app.use(helmet());
if (app.get('env') === 'development'){
    app.use(morgan("tiny"));
    debug('morgan enabled...');
}


const port = process.env.port || 8002;
app.listen(port, () => console.log(`Listening on port ${port}`));