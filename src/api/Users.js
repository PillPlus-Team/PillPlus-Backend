const express = require('express');
const User = require('../models/userSchema');

const router = express.Router();

router.get('/', (req, res) => {
    User.find({}, (err, data) => {
        res.json(data);
    })
});

router.post('/register', async (req, res) => {
    const user = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    try {
        const Users = await user.save();
        res.status(201).json(Users);
    } catch (err) {
        res.status(400).json(err["errors"]);
    }
})

module.exports = router;