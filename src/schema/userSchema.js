const db = require('../db');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: 'string',
        require: true,
        unique: true,
        lowercase: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, "Email invalid syntax"],
    },
    username: {
        type: 'string',
        require: true,
        minLength: [6, "Minimum 6 character"],
        maxLength: [255, "Maximum 255 characters"]
    },
    password: {
        type: 'string',
        require: true,
        maxLength: [1024, "Maximum 1024 characters"]
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = db.model('User', userSchema);