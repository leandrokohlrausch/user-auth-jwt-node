const routes = require('./routes');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);
app.use(errors());
app.use(helmet());

module.exports = app;
