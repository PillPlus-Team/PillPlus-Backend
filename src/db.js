const mongoose = require('mongoose')

mongoose.connect(process.env.DB_URI, { 
    useNewUrlParser: true,
    autoIndex: false,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected!');
}).catch (err => {
    console.log('Cannot connect to database!', err);
    process.exit();
})