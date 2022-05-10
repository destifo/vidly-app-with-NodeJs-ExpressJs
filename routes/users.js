
const Express = require('express');
const router = Express.Router();
const { User, validateUser } = require('../models/User');

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    try {
        const result = await user.save();
        res.send(result);
    }
    catch(ex){
        res.status(400).send(" User already registered.");
    }
});

module.exports.router = router;