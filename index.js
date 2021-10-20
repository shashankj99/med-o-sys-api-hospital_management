const express = require('express');
const cors = require("cors");

const db = require('./models');
const routes = require('./routes');
const APP_ENV = require("./config").APP_ENV;

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));

// accept the json request with a memory limit of max 50 mb.
app.use(express.json());

if (APP_ENV === "development") {
    app.listen(35802, () => {
        console.log('App is listening to port 35802');
    });
    
    // models connectivity
    db.sequelize.sync()
        .then(() => console.log('DB connection successful'))
        .catch(err => console.log(err.message));
}

// include all routes
app.use('/', routes);
