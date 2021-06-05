const config = require('../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.DB_DATABASE, config.DB_USERNAME, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.hospitals = require('./hospital_model')(sequelize, Sequelize);

module.exports = db;
