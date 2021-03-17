const mongoose = require('mongoose');


const db = mongoose.createConnection(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true}, () => {
    console.log('connected to db!');
});

module.exports = db;