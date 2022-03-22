const Express = require('express');
const { append } = require('express/lib/response');
const Joi = require('joi');
const app = Express();

app.use(Express.json());

let genres = [
    {
        id: 1,
        name: 'Action',
    },
    {
        id: 2,
        name: 'Fantasy'
    },
    {
        id: 3,
        name: 'Sci-fi'
    },
    {
        id: 4,
        name: 'Shounen'
    },
    {
        id: 5,
        name: 'Psychological'
    }
]

app.get('/api/genres', (req, res) => {
    res.send(genres.map(genre => genre));
});

app.get('/api/genres/:id', (req, res) => {
    const genreid = parseInt(req.params.id);
    const genre = genres.find(genre => genre.id === genreid); 
    if (!genre) return res.status(404).send("Genre with given id no t found");
    return res.send(genre);
});

app.post('/api/genres', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const newGenre = {
        id: genres.length + 1,
        name: req.body.name
    };
    genres.push(newGenre);

    res.send(newGenre);
});

app.put('/api/genres/:id', (req, res) => {
    const { error } = validateGenre(req.body);
    if (error)  return res.status(400).send(error.details[0].message);

    const genreid = parseInt(req.params.id);
    let genre = genres.find(genre => genre.id === genreid);

    if (!genre) return res.status(404).send("Genre with the given id not found");

    genre.name = req.body.name;
    res.status(200).send(genre);
});

app.delete('/api/genres/:id', (req, res) => {
    const genreid = parseInt(req.params.id);
    const genre = genres.find(genre => genre.id === genreid);

    if (!genre) return res.status(404).send("Genre with the given id was not found");

    const genreIndex = genres.findIndex(genre);
    genres.splice(genreIndex, 1);

    res.send(genre);    
});


function validateGenre(genre){
    const schema = {
        name: Joi.string().min(2).required()
    };

    return Joi.validate(genre, schema);
}


const port = process.env.port || 8002;
app.listen(port, () => console.log(`Listening on port ${port}`));