
const Express = require('express');
const mongoose = require('mongoose');
const router = Express.Router();
const {Customer, validateCustomer} = require('../models/Customer');


router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
        res.status(404).send("Customer with the given id was not found");

    res.send(customer);
});

router.post('/', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error)
        res.status(400).send(error.details[0].message);

    const newCustomer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
    });
    const result = await newCustomer.save();

    res.send(result);
});

router.put('/:id', async (req, res) => {
    const { error } = validateCustomer(req.body);
    if (error)
        res.send(400).send(error.details[0].message);

    const customer = await Customer.findById(req.params.id);
    if (!customer)
        res.status(404).send("Customer with the given id wasn't found");

    customer.set({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
    });

    try{
        const result = await customer.save();
        res.send(result);
    }catch(ex) {
        res.send(ex.message);
    }
});

router.delete('/:id', async (req, res) => {
    const result = await Customer.findByIdAndRemove(req.params.id);

    if (!result)    res.status(404).send('Customer was not found.');

    res.send(result);
});



module.exports = router;