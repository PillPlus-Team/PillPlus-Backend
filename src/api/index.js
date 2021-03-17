const express = require('express');

const Users = require('./Users');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'API - 👋🌎🌎🌎'
    });
});

router.use('/users', Users);

module.exports = router;
