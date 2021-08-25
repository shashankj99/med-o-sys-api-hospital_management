// package imports
const moment = require("moment");

// custom modules imports
const ModelNotFoundException = require("../exceptions/model-not-found-exception");
const ServiceException = require("../exceptions/service.exception");
const db = require("../models");
const weekDay = require("../services/weekdays");
const AuthUser = require("../facade/auth_user");

// constants
const OpdHour = db.opdHours;
const Hospital = db.hospitals;

const OpdHourController = {
    /**
     * @description Method to create opd hour
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    create: async (req, res) => {
        try {
            // get hospital id from params
            const hospital_id = req.params.hospital_id;

            // check if user is a hospital admin
            if (AuthUser.hospital()) {
                if (hospital_id !== AuthUser.hospital.hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // returns array
            // index 0 is a boolean that checks if the passed day belongs to the week days or not
            // index 1 has the day value with first character as uppercase
            const day = weekDay(req.body.day);

            // check whether the entered week day is actually one of the days of the week
            if (!day[0])
                throw new ServiceException(400, "Week day must be a valid day of a week");

            // find hospital by id
            const hospital = await Hospital.findByPk(hospital_id, {
                include: {
                    model: OpdHour,
                    as: "opd_hours",
                    attributes: ["day"]
                }
            });

            // throw error if not found
            if (!hospital)
                throw new ModelNotFoundException("Unable to find the hospital");

            // check if the opd hour already exists or not
            const opd_hour_exists = hospital.opd_hours.some(opdHour => opdHour.day === day[1]);

            // throw error if exists
            if (opd_hour_exists)
                throw new ServiceException(409, "-- opd hour has already been created --");

            // make opening time and closing time objects
            const opening_time = moment(req.body.opening_time, "HH:mm:ss"),
                closing_time = moment(req.body.closing_time, "HH:mm:ss");

            // check if closing time is after the opening time
            if (!closing_time.isAfter(opening_time))
                throw new ServiceException(400, "Closing time must be after the opening time");

            // get all attributes
            const attributes = {
                hospital_id: hospital_id,
                day: day[1],
                opening_time: req.body.opening_time,
                closing_time: req.body.closing_time,
                is_open: true
            };

            // create opd hour
            await OpdHour.create(attributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            status: 200,
                            message: "Opd hour added successfully"
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            stauts: 500,
                            message: err.message
                        });
                });
        } catch (err) {
            if (err.hasOwnProperty("status"))
                return res.status(err.status)
                    .json({
                        status: err.status,
                        message: err.message
                    });

            return res.status(500)
                .json({
                    status: 500,
                    message: err.message
                });
        }
    },

    /**
     * @description Method to list all the opd hours of a hospital
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    index: async (req, res) => {
        try {
            // get hospital id from params
            const hospital_id = req.params.hospital_id;

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (hospital_id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // get all opd hoours of a hospital
            await OpdHour.findAll({ where: { hospital_id } })
                .then(resposne => {
                    return res.status(200)
                        .json({
                            status: 200,
                            data: resposne
                        })
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            status: 500,
                            message: err.message
                        })
                });

        } catch (err) {
            if (err.hasOwnProperty("status"))
                return res.status(err.status)
                    .json({
                        status: err.status,
                        message: err.message
                    });

            return res.status(500)
                .json({
                    status: 500,
                    message: err.message
                });
        }
    },

    /**
     * @description Method to get the opd hour detail
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    show: async (req, res) => {
        try {
            // get hospital id and opd hour id
            const hospital_id = req.params.hospital_id,
                opd_hour_id = req.params.opd_hour_id;

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (hospital_id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // get the opd hour detail
            await OpdHour.findOne({ where: { id: opd_hour_id, hospital_id } })
                .then(response => {
                    // throw model not found error 
                    if (!response)
                        throw new ModelNotFoundException("-- Unable to find the opd hour --");

                    return res.status(200)
                        .json({
                            status: 200,
                            data: response
                        });
                })
                .catch(err => {
                    if (err.hasOwnProperty("status"))
                        return res.status(err.status)
                            .json({
                                status: err.status,
                                message: err.message
                            });
                    return res.status(500)
                        .json({
                            status: 500,
                            message: err.message
                        })
                });
        } catch (err) {
            return res.status(500)
                .json({
                    status: 500,
                    message: err.message
                });
        }
    },

    /**
     * @description Method to update the opd hour
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    update: async (req, res) => {
        try {
            // get hospital id and opd hour id
            const hospital_id = req.params.hospital_id,
                opd_hour_id = req.params.opd_hour_id;

            let updated_day = "";

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (hospital_id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // get the opd hour detail
            const opd_hour = await OpdHour.findOne({ where: { id: opd_hour_id, hospital_id } });

            // throw not found error
            if (!opd_hour)
                throw new ModelNotFoundException("-- Unable to find the opd hour --");

            // check if the stored day is equal to the entered day or not
            if (opd_hour.day.toLowerCase() !== req.body.day.toLowerCase()) {
                // returns array
                // index 0 is a boolean that checks if the passed day belongs to the week days or not
                // index 1 has the day value with first character as uppercase
                const day = weekDay(req.body.day);

                // check whether the entered week day is actually one of the days of the week
                if (!day[0])
                    throw new ServiceException(400, "-- Week day must be a valid day of a week --");

                // check if the opd hour already exists or not
                const opd_hour_exists = await OpdHour.findOne({
                    where: {
                        hospital_id,
                        day: day[1]
                    }
                });

                // throw error if exists
                if (opd_hour_exists)
                    throw new ServiceException(409, "-- opd hour has already been created --");

                // change updated day
                updated_day = day[1];
            } else if (opd_hour.day === req.body.day) {
                // change updated_day
                updated_day = opd_hour.day;
            } else {
                // returns array
                // index 0 is a boolean that checks if the passed day belongs to the week days or not
                // index 1 has the day value with first character as uppercase
                const day = weekDay(req.body.day);

                // check whether the entered week day is actually one of the days of the week
                if (!day[0])
                    throw new ServiceException(400, "-- Week day must be a valid day of a week --");

                // change updated day
                updated_day = day[1];
            }

            // make opening time and closing time objects
            const opening_time = moment(req.body.opening_time, "HH:mm:ss"),
                closing_time = moment(req.body.closing_time, "HH:mm:ss");

            // check if closing time is after the opening time
            if (!closing_time.isAfter(opening_time))
                throw new ServiceException(400, "-- Closing time must be after the opening time --");

            // get all attributes
            const attributes = {
                hospital_id: hospital_id,
                day: updated_day,
                opening_time: req.body.opening_time,
                closing_time: req.body.closing_time,
                is_open: (req.body.is_open) ? req.body.is_open : opd_hour.is_open
            };

            // update opd hour
            await opd_hour.update(attributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            status: 200,
                            message: "-- Opd hour updated successfully --"
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            status: 500,
                            message: err.message
                        })
                });
        } catch (err) {
            if (err.hasOwnProperty("status"))
                return res.status(err.status)
                    .json({
                        status: err.status,
                        message: err.message
                    });

            return res.status(500)
                .json({
                    status: 500,
                    message: err.message
                });
        }
    },

    /**
     * @description Method to delete the opd hour
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    destroy: async (req, res) => {
        try {
            // get hospital id and opd hour id
            const hospital_id = req.params.hospital_id,
                opd_hour_id = req.params.opd_hour_id;


            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (hospital_id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // delete the opd hour
            await OpdHour.destroy({
                where: {
                    id: opd_hour_id,
                    hospital_id
                }
            })
                .then(response => {
                    // throw model not found error 
                    if (!response)
                        throw new ModelNotFoundException("-- Unable to find the opd hour --");

                    return res.status(200)
                        .json({
                            status: 200,
                            message: "-- Opd hour deleted successfully --"
                        });
                })
                .catch(err => {
                    if (err.hasOwnProperty("status"))
                        return res.status(err.status)
                            .json({
                                status: err.status,
                                message: err.message
                            });
                    return res.status(500)
                        .json({
                            status: 500,
                            message: err.message
                        })
                });
        } catch (err) {
            return res.status(500)
                .json({
                    status: 500,
                    message: err.message
                });
        }
    }
};

module.exports = OpdHourController;