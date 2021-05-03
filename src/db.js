const db = require('./models');
const ID = db.id;
const Queue = db.queue;
const mongoose = db.mongoose;

mongoose.connect(process.env.DB_URI, { 
    useNewUrlParser: true,
    autoIndex: false,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Database connected!');
    initial();
}).catch (err => {
    console.log('Cannot connect to database!', err);
    process.exit();
})

function initial() {
    Queue.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Queue({
                name: "Invoice", count: 0
            }).save(err => {
                if (err) {
                    console.log(err);
                }

                console.log("added 'Invoice's queue' to queues collection!");
            });

            new Queue({
                name: "Prescription", count: 0
            }).save(err => {
                if (err) {
                    console.log(err);
                }

                console.log("added 'Prescription's queue' to queues collection!");
            });
        }
    });

    ID.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new ID({
                name: "PS", count: 0
            }).save(err => {
                if (err) {
                    console.log(err);
                }

                console.log("added 'ID' to id collection!");
            });
        }
    });
}