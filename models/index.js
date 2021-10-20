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
db.hospitalMetaData = require("./hospital_metadata")(sequelize, Sequelize);
db.departments = require('./department.model')(sequelize, Sequelize);
db.paymentHistories = require('./payment_history.model')(sequelize, Sequelize);
db.doctors = require("./doctor.model")(sequelize, Sequelize);
db.opdHours = require("./opd_hours.model")(sequelize, Sequelize);
db.doctorMetadata = require("./doctor_metadata.model")(sequelize, Sequelize);
db.doctorHours = require("./doctor_hours.model")(sequelize, Sequelize);
db.departmentBeds = require("./department_beds")(sequelize, Sequelize);

db.associations = require('./associations')(sequelize);

module.exports = db;
