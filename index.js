const express = require('express');

const db = require('./models');
const routes = require('./routes');
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

// accept the json request with a memory limit of max 50 mb.
app.use(express.json({ limit: "50mb" }));

app.listen(35802, () => {
    console.log('App is listening to port 35802');
});

// models connectivity
db.sequelize.sync()
    .then(() => console.log('DB connection successful'))
    .catch(err => console.log(err.message));

// include all routes
app.use('/', routes);
