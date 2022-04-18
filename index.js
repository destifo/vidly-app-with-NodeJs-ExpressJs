const Express = require('express');
const { append } = require('express/lib/response');
const genres = require('./routes/genre');
const app = Express();
const morgan = require('morgan');
const helmet = require('helmet');
const debug = require('debug')('app:startup');
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost/vidly").then(() => console.log("Connected to MongoDb...")).catch(err => console.error("Connection to MongoDb was unsuccessful"));

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }))
app.use('/api/genres', genres);
app.use(helmet());
if (app.get('env') === 'development'){
    app.use(morgan("tiny"));
    debug('morgan enabled...');
}


const port = process.env.port || 8002;
app.listen(port, () => console.log(`Listening on port ${port}`));