const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

const middleware = require("./middleware");
const api = require("./api");

const app = express();

app.use(express.json());

app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
    res.send("Hello World! 🌎🌎🌎🌏🌍");
});

app.use('/api/v1',api);

app.use(middleware.notFound);
app.use(middleware.errorHandler);

module.exports = app;