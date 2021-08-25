const moment = require("moment");

const ModelNotFoundException = require("../exceptions/model-not-found-exception");
const ServiceException = require("../exceptions/service.exception");
const db = require("../models");
const AuthUser = require("../facade/auth_user");
const weekDay = require("../services/weekdays");

const Hospital = db.hospitals;
const DoctorHour = db.doctorHours;
const Doctor = db.doctors;
const OpdHour = db.opdHours;

const DoctorHourController = {
    /**
     * @description Method to create doctor hour
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    create: async (req, res) => {
        try {
            // get doctor id
            const doctor_id = req.params.doctor_id;

            // returns array
            // index 0 is a boolean that checks if the passed day belongs to the week days or not
            // index 1 has the day value with first character as uppercase
            const day = weekDay(req.body.day);

            // check whether the entered week day is actually one of the days of the week
            if (!day[0])
                throw new ServiceException(400, "Week day must be a valid day of a week");

            // get doctor id & opening and closing time of the hosital associated with the doctor
            const doctor = await Doctor.findByPk(doctor_id, {
                include: [
                    {
                        model: Hospital,
                        as: "hospital",
                        attributes: ['id'],
                        include: {
                            model: OpdHour,
                            as: "opd_hours",
                            attributes: ['opening_time', 'closing_time'],
                            where: {
                                day: day[1]
                            }
                        }
                    },
                    {
                        model: DoctorHour,
                        as: "doctor_hours",
                        attributes: ["day"]
                    }
                ],
                attributes: ['id']
            });

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (doctor.hospital.id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // throw not found error if doctor doesn't exist
            if (!doctor)
                throw new ModelNotFoundException("Unable to find the doctor")

            // throw service error if hospital opd is not set
            if (!doctor.hospital)
                throw new ServiceException(400, "The OPD hours have not been set for the hospital yet");

            // check if doctor hour already exists
            const doctor_hour_exists = doctor.doctor_hours.some(doctorHour => doctorHour.day === day[1]);

            // throw error if exists
            if (doctor_hour_exists)
                throw new ServiceException(400, "The doctor hour has already been created");

            // time calculation
            const available_from = moment(req.body.available_from, "HH:mm:ss"),
                available_to = moment(req.body.available_to, "HH:mm:ss"),
                opening_time = moment(doctor.hospital.opd_hours[0].opening_time, "HH:mm:ss"),
                closing_time = moment(doctor.hospital.opd_hours[0].closing_time, "HH:mm:ss");

            // check doctor available time and opd hours
            if ((available_from.isBefore(opening_time) || available_to.isBefore(opening_time)) || (available_from.isAfter(closing_time) || available_to.isAfter(closing_time)))
                throw new ServiceException(400, "Doctor's available time must be in between opening and closing hours");

            // check if available from is before available to
            if (available_to.isBefore(available_from))
                throw new ServiceException(400, "Available to must be after available from");

            const attributes = {
                doctor_id,
                day: day[1],
                available_from: req.body.available_from,
                available_to: req.body.available_to,
                is_available: true
            };

            // create doctor hour
            await DoctorHour.create(attributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            status: 200,
                            message: "Doctor hour created successfully"
                        });
                }).catch((err) => {
                    return res.status(500)
                        .json({
                            status: 500,
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
     * @description Method to display the list of doctor hours
     * @param {*} req 
     * @param {*} res 
     */
    index: async (req, res) => {
        // get doctor id
        const doctor_id = req.params.doctor_id;

        await DoctorHour.findAll({
            where: { doctor_id },
            include: {
                model: Doctor,
                as: "doctor",
                attributes: ["id"],
                include: {
                    model: Hospital,
                    as: "hospital",
                    attributes: ["id"]
                }
            }
        }).then(doctorHour => {
            // check if user is hospital admin
            if (AuthUser.hospital()) {
                if (doctorHour[0].doctor.hospital.id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            return res.status(200)
                .json({
                    status: 200,
                    data: doctorHour
                });
        })
            .catch(err => {
                return res.status(500)
                    .json({
                        status: 500,
                        message: err.message
                    });
            });
    },

    /**
     * @description Method to get the detail of doctor hour
     * @param {*} req 
     * @param {*} res 
     */
    show: async (req, res) => {
        // get doctor id and doctor hour id,
        const { doctor_id, doctor_hour_id } = req.params;

        // find doctor hour
        await DoctorHour.findOne({
            where: {
                id: doctor_hour_id,
                doctor_id
            },
            include: {
                model: Doctor,
                as: "doctor",
                attributes: ["id"],
                include: {
                    model: Hospital,
                    as: "hospital",
                    attributes: ["id"]
                }
            }
        }).then(doctorHour => {
            // throw not found error
            if (!doctorHour)
                throw new ModelNotFoundException("Unable to find the doctor hour");

            // check if user is hospital admin
            if (AuthUser.hospital()) {
                if (doctorHour.doctor.hospital.id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            return res.status(200)
                .json({
                    status: 200,
                    data: doctorHour
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
                    });
            });
    },

    /**
     * @description Method to update doctor hour
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    update: async (req, res) => {
        try {
            // get doctor id and doctor hour id
            const { doctor_id, doctor_hour_id } = req.params;

            // get the doctor hour object
            const doctor_hour = await DoctorHour.findByPk(doctor_hour_id);

            // throw not found exception if object is empty
            if (!doctor_hour)
                throw new ModelNotFoundException("Unable to find the doctor hour");

            // returns array
            // index 0 is a boolean that checks if the passed day belongs to the week days or not
            // index 1 has the day value with first character as uppercase
            const day = weekDay(req.body.day);

            // check whether the entered week day is actually one of the days of the week
            if (!day[0])
                throw new ServiceException(400, "Week day must be a valid day of a week");

            // get doctor id & opening and closing time of the hosital associated with the doctor
            const doctor = await Doctor.findByPk(doctor_id, {
                include: [
                    {
                        model: Hospital,
                        as: "hospital",
                        attributes: ['id'],
                        include: {
                            model: OpdHour,
                            as: "opd_hours",
                            attributes: ['opening_time', 'closing_time'],
                            where: {
                                day: day[1]
                            }
                        }
                    },
                    {
                        model: DoctorHour,
                        as: "doctor_hours",
                        attributes: ["day"]
                    }
                ],
                attributes: ['id']
            });

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (doctor.hospital.id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // throw not found error if doctor doesn't exist
            if (!doctor)
                throw new ModelNotFoundException("Unable to find the doctor")

            // throw service error if hospital opd is not set
            if (!doctor.hospital)
                throw new ServiceException(400, "The OPD hours have not been set for the hospital yet");

            // check if requested day and the day in doctor hour object are similar or not
            if (doctor_hour.day != day[1]) {
                // check if doctor hour already exists
                const doctor_hour_exists = doctor.doctor_hours.some(doctorHour => doctorHour.day === day[1]);

                // throw error if exists
                if (doctor_hour_exists)
                    throw new ServiceException(400, "The doctor hour has already been created");
            }

            // time calculation
            const available_from = moment(req.body.available_from, "HH:mm:ss"),
                available_to = moment(req.body.available_to, "HH:mm:ss"),
                opening_time = moment(doctor.hospital.opd_hours[0].opening_time, "HH:mm:ss"),
                closing_time = moment(doctor.hospital.opd_hours[0].closing_time, "HH:mm:ss");

            // check doctor available time and opd hours
            if ((available_from.isBefore(opening_time) || available_to.isBefore(opening_time)) || (available_from.isAfter(closing_time) || available_to.isAfter(closing_time)))
                throw new ServiceException(400, "Doctor's available time must be in between opening and closing hours");

            // check if available from is before available to
            if (available_to.isBefore(available_from))
                throw new ServiceException(400, "Available to must be after available from");

            const attributes = {
                doctor_id,
                day: day[1],
                available_from: req.body.available_from,
                available_to: req.body.available_to,
                is_available: (req.body.is_available) ? req.body.is_available : true
            };

            await doctor_hour.update(attributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            status: 200,
                            message: "Doctor hour updated successfully"
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            status: 500,
                            message: err.message
                        });
                })

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
     * @description Method to delete the doctor hour
     * @param {*} req 
     * @param {*} res 
     */
    destroy: async (req, res) => {
        // get doctor id and doctor hour id,
        const { doctor_id, doctor_hour_id } = req.params;

        // delete doctor hour
        await DoctorHour.destroy({
            where: {
                id: doctor_hour_id,
                doctor_id
            },
            include: {
                model: Doctor,
                as: "doctor",
                attributes: ["id"],
                include: {
                    model: Hospital,
                    as: "hospital",
                    attributes: ["id"]
                }
            }
        }).then(doctorHour => {
            // throw not found error
            if (!doctorHour)
                throw new ModelNotFoundException("Unable to find the doctor hour");

            // check if user is hospital admin
            if (AuthUser.hospital()) {
                if (doctorHour.doctor.hospital.id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            return res.status(200)
                .json({
                    status: 200,
                    message: "Doctor hour deleted successfully"
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
                    });
            });
    }

};

module.exports = DoctorHourController;