const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

require("dotenv").config();

//const middleware = require("./common/middleware");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const app = express();

app.use(express.json());

app.use(helmet());
app.use(cors());

// app.use('/api/v1',api);
app.use('/', indexRouter);
app.use('/users',usersRouter);

// app.use(middleware.notFound);
// app.use(middleware.errorHandler);

module.exports = app;