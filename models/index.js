const config = require('../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.DB_DATABASE, config.DB_USERNAME, config.DB_PASSWORD, {
    host: config.DB_HOST,
    dialect: config.DB_DIALECT,
    timezone: "+05:45"
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.hospitals = require('./hospital_model')(sequelize, Sequelize);
db.departments = require('./department.model')(sequelize, Sequelize);
db.paymentHistories = require('./payment_history.model')(sequelize, Sequelize);

db.associations = require('./associations')(sequelize);

module.exports = db;
