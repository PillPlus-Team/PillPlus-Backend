const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

require("dotenv").config();
require("./db");

const middleware = require("./common/middleware");
const api = require("./api");

const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(helmet());
app.use(cors());

app.use(cookieParser());

app.use("/api/v1", api);

app.use(middleware.notFound);

module.exports = app;
