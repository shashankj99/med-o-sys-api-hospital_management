const db = require("../models");
const AuthUser = require("../facade/auth_user");
const ModelNotFoundException = require("../exceptions/model-not-found-exception");
const fetchUser = require("../services/fetch_user");
const ServiceException = require("../exceptions/service.exception");

const sequelize = db.sequelize;
const Doctor = db.doctors;
const Hospital = db.hospitals;
const Department = db.departments;
const DoctorMetaData = db.doctorMetadata;

const DoctorController = {
    /**
     * Method to get all doctors of a department of a hospital
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    index: async (req, res) => {
        const hospitalId = req.params.hospital_id,
            departmentId = req.params.department_id;

        // authorization check for hospital admin
        if (AuthUser.hospital()) {
            if (hospitalId !== AuthUser.hospital().hospital_id)
                return res.status(403)
                    .json({
                        status: 403,
                        message: "Forbidden"
                    })
        }

        // fetch doctors
        await Doctor.findAll({
            where: {
                hospital_id: hospitalId,
                department_id: departmentId,
                status: (req.query.status) ? req.query.status : 1
            }
        })
            .then(response => {
                return res.status(200)
                    .json({
                        status: 200,
                        data: response
                    })
            })
            .catch(err => {
                return res.status(500)
                    .json({
                        status: 500,
                        message: err.message
                    });
            })
    },

    /**
     * Method to add doctor to a department of a hospital
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    create: async (req, res) => {
        try {
            const hospitalId = req.params.hospital_id,
                departmentId = req.params.department_id;

            // auth check for hospital admin
            if (AuthUser.hospital()) {
                if (hospitalId !== AuthUser.hospital().hospital_id)
                    return res.status(403)
                        .json({
                            status: 403,
                            message: "Forbidden"
                        })
            }

            const transaction = await sequelize.transaction();

            // fetch hospital and department
            const hospital = await Hospital.findByPk(hospitalId, {
                include: [{
                    model: Department,
                    as: "departments",
                    where: { id: departmentId },
                    attributes: ["id"]
                }]
            });

            // throw error if hospital doesn't exist
            if (!hospital)
                throw new ModelNotFoundException("Unable to find the hospital &/or departments");

            // fetch user details from auth service
            const getUserDetailsFromAuthService = await fetchUser.get_user_details_from_auth_service(
                req.body.email_address,
                req.headers["authorization"]
            );

            // throw error if status is not 200
            if (getUserDetailsFromAuthService.status !== 200)
                throw new ServiceException(
                    getUserDetailsFromAuthService.status,
                    getUserDetailsFromAuthService.message
                );

            // doc attributes
            const doctorAttributes = {
                hospital_id: hospitalId,
                department_id: departmentId,
                reg_no: req.body.reg_no,
                degree: req.body.degree,
                speciality: req.body.speciality,
                on_call: req.body.on_call,
                user_id: getUserDetailsFromAuthService.data.id,
                full_name: `Dr. ${getUserDetailsFromAuthService.data.full_name}`,
                email_address: getUserDetailsFromAuthService.data.email,
                mobile_number: getUserDetailsFromAuthService.data.mobile
            };

            // add doctor data
            await Doctor.create(doctorAttributes, { transaction })
                .then(async doctor => {

                    // doctor meta data attributes
                    const meta_data_attributes = {
                        doctor_id: doctor.id,
                        type: req.body.type,
                        per_patient_time: req.body.per_patient_time
                    }

                    // create doctor meta data
                    await DoctorMetaData.create(meta_data_attributes, { transaction })
                        .then(() => {
                            transaction.commit();
                            return res.status(200)
                                .json({
                                    status: 200,
                                    message: "Doctor added successfully and is pending approval"
                                });
                        })
                        .catch(err => {
                            transaction.rollback();
                            return res.status(500)
                                .json({
                                    stauts: 500,
                                    message: err.message
                                });
                        });
                })
                .catch(err => {
                    transaction.rollback();
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
     * Method to get doctor details
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    show: async (req, res) => {
        try {
            // get requried ids
            const hospitalId = req.params.hospital_id,
                departmentId = req.params.department_id,
                doctorId = req.params.doctor_id;

            // fetch doctor
            const doctor = await Doctor.findOne({
                where: {
                    id: doctorId,
                    hospital_id: hospitalId,
                    department_id: departmentId
                },
                include: {
                    model: DoctorMetaData,
                    as: "doctor_meta_data",
                    attributes: ['type', 'per_patient_time', 'total_patient_count', 'mortality_rate']
                }
            });

            // throw error if not found
            if (!doctor)
                throw new ModelNotFoundException("Unable to find the doctor");

            return res.status(200)
                .json({
                    status: 200,
                    data: doctor
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
     * Method to update the doctor details
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    update: async (req, res) => {
        try {
            // get requried ids
            const hospitalId = req.params.hospital_id,
                departmentId = req.params.department_id,
                doctorId = req.params.doctor_id;

            // fetch doctor
            const doctor = await Doctor.findOne({
                where: {
                    id: doctorId,
                    hospital_id: hospitalId,
                    department_id: departmentId
                },
                include: {
                    model: DoctorMetaData,
                    as: "doctor_meta_data"
                }
            });

            // throw error if not found
            if (!doctor)
                throw new ModelNotFoundException("Unable to find the doctor");

            const transaction = await sequelize.transaction();

            // doc attributes
            const doctorAttributes = {
                hospital_id: hospitalId,
                department_id: departmentId,
                reg_no: req.body.reg_no,
                degree: req.body.degree,
                speciality: req.body.speciality,
                on_call: req.body.on_call
            };

            if (doctor.email_address !== req.body.email_address) {
                // fetch user details from auth service
                const getUserDetailsFromAuthService = await fetchUser.get_user_details_from_auth_service(
                    req.body.email_address,
                    req.headers["authorization"]
                );

                // throw error if status is not 200
                if (getUserDetailsFromAuthService.status !== 200)
                    throw new ServiceException(
                        getUserDetailsFromAuthService.status,
                        getUserDetailsFromAuthService.message
                    );

                doctorAttributes.user_id = getUserDetailsFromAuthService.user_id;
                doctorAttributes.full_name = getUserDetailsFromAuthService.full_name;
                doctorAttributes.email_address = getUserDetailsFromAuthService.email;
                doctorAttributes.mobile_number = getUserDetailsFromAuthService.mobile;
            }

            // update doctor detail
            await doctor.update(doctorAttributes, { transaction })
                .then(async doctor => {

                    const attributes = {
                        type: req.body.type,
                        per_patient_time: req.body.per_patient_time,
                        total_patient_count: req.body.total_patient_count,
                        mortality_rate: req.body.mortality_rate
                    };

                    await doctor.doctor_meta_data.update(attributes, { transaction })
                        .then(() => {
                            transaction.commit();
                            return res.status(200)
                                .json({
                                    status: 200,
                                    message: "Doctor updated successfully"
                                });
                        })
                        .catch(err => {
                            transaction.rollback();
                            return res.status(500)
                                .json({
                                    stauts: 500,
                                    message: err.message
                                });
                        });
                })
                .catch(err => {
                    transaction.rollback();
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
     * Method to delete the doctor
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    destroy: async (req, res) => {
        try {
            // get requried ids
            const hospitalId = req.params.hospital_id,
                departmentId = req.params.department_id,
                doctorId = req.params.doctor_id;

            await Doctor.destroy({
                where: {
                    id: doctorId,
                    hospital_id: hospitalId,
                    department_id: departmentId
                }
            }).then(doctor => {
                if (!doctor)
                    throw new ModelNotFoundException("Unable to find the doctor");

                return res.status(200)
                    .json({
                        status: 200,
                        message: "Doctor deleted successfully"
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
     * Method to change doctor status
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    change_doctor_status: async (req, res) => {
        try {
            const doctorId = req.params.doctor_id;

            // get doctor by id
            const doctor = await Doctor.findByPk(doctorId);

            if (!doctor)
                throw new ModelNotFoundException("unable to find the doctor");

            // change doctor status
            await doctor.update({ status: req.body.status })
                .then(() => {
                    return res.status(200)
                        .json({
                            status: 200,
                            message: `Status updated to ${req.body.status}`
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
            if (err.hasOwnProperty('status'))
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
    }
};

module.exports = DoctorController
