const db = require('../models');
const AuthUser = require('../facade/auth_user');

const Hospital = db.hospitals;
const Department = db.departments;
const sequelize = db.sequelize;

const HospitalController = {

    /**
     * Method to view the list of hospitals
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    get_all_hospitals: async (req, res) => {
        try {
            // get all hospitals
            await Hospital.findAll().then(response => {
                    return res.status(200)
                        .json({
                            status: 200,
                            data: response
                        })
                }).catch(err => {
                    return res.status(400)
                        .json({
                            status: 400,
                            message: err.message
                        });
                })
        } catch (err) {
            return res.status(500)
                .json({
                    status: 500,
                    message: err.message
                });
        }
    },

    /**
     * Method to create a hospital
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    create_hospital: async (req, res) => {
        try {
            // get attribute from request body
            const hospitalAttributes = {
                name:           req.body.name,
                address:        req.body.address,
                no_of_beds:     req.body.no_of_beds,
                phone_no:       req.body.phone_no,
                mobile_no:      req.body.mobile_no,
                email_address:  req.body.email_address,
                website:        req.body.website,
                status:         false
            }
            
            // transaction object
            const transaction = await sequelize.transaction();
            
            // create hospital
            await Hospital.create(hospitalAttributes, {transaction})
                .then(async hospital => {
                    // get the department id from request
                    const departments = req.body.departments;
                    
                    // find departments associated to that id
                    await Department.findAll({ where: {id: departments} })
                        .then(departments => {
                            // add department to the hospital
                            hospital.addDepartments(departments);

                            // commit DB transaction
                            transaction.commit();
                            return res.status(200)
                                .json({
                                    status: 200,
                                    message: 'Hospital created successfully'
                                });
                        }).catch(err => {
                            transaction.rollback();
                            return res.status(400)
                                .json({
                                    status: 400,
                                    message: err.message
                                });
                        });
                }).catch(err => {
                    transaction.rollback();
                    return res.status(400)
                        .json({
                            status: 400,
                            message: err.message
                        });
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
     * Method to get the detail of a hospital
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    get_hospital_detail: async (req, res) => {
        try {
            // get hospital id
            let hospitalId = req.params.hospital_id;

            // if user is a hospital admin then check if user has access to the given hospital
            if (AuthUser.hospital()) {
                if (hospitalId !== AuthUser.hospital().hospital_id)
                    return res.status(403)
                        .json({
                            status: 403,
                            message: 'Forbidden'
                        });
            }

            // get the required hospital
            await Hospital.findByPk(hospitalId, {
                include: {
                    model: Department,
                    as: 'departments',
                    attributes: ['id', 'name', 'nepali_name'],
                    through: {attributes: []}
                }
            }).then(hospital => {
                    // return not found error
                    if (!hospital)
                        return res.status(404)
                            .json({
                                status: 404,
                                message: 'Unable to find the hospital'
                            });

                    return res.status(200)
                        .json({
                            status: 200,
                            data: hospital
                        });
                })
                .catch(err => {
                    return res.status(400)
                        .json({
                            status: 400,
                            message: err.message
                        });
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
     * Method to update hospital request
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    update_hospital_detail: async (req, res) => {
        try {
            // get hospital id
            let hospitalId = req.params.hospital_id;

            // if user is a hospital admin then check if user has access to the given hospital
            if (AuthUser.hospital()) {
                if (hospitalId !== AuthUser.hospital().hospital_id)
                    return res.status(403)
                        .json({
                            status: 403,
                            message: 'Forbidden'
                        });
            }

            // transaction object
            const transaction = await sequelize.transaction();

            // find the hospital
            await Hospital.findByPk(hospitalId)
                .then(async hospital => {
                    // return not found error
                    if (!hospital)
                        return  res.status(404)
                            .json({
                                status: 404,
                                message: 'Unable to find the hospital'
                            });

                    // get hospital attributes
                    const hospitalAttributes= {
                        name:           req.body.name,
                        address:        req.body.address,
                        no_of_beds:     req.body.no_of_beds,
                        phone_no:       req.body.phone_no,
                        mobile_no:      req.body.mobile_no,
                        email_address:  req.body.email_address,
                        website:        req.body.website,
                    };

                    // update hospital detail
                    await hospital.update(hospitalAttributes, {transaction})
                        .then(async () => {
                            // get the department id
                            const departmentId = req.body.departments;

                            // get all departments
                            await Department.findAll({ where: {id: departmentId} })
                                .then(departments => {
                                    // set departments for the hospital
                                    hospital.setDepartments(departments);
                                    transaction.commit();
                                    return res.status(200)
                                        .json({
                                            status: 200,
                                            message: 'Hospital updated successfully'
                                        });
                                }).catch(err => {
                                    transaction.rollback();
                                    return res.status(400)
                                        .json({
                                            status: 400,
                                            message: err.message
                                        })
                                });
                        }).catch(err => {
                            transaction.rollback();
                            return res.status(400)
                                .json({
                                    status: 400,
                                    message: err.message
                                })
                        });
                }).catch(err => {
                    transaction.rollback();
                    return res.status(400)
                        .json({
                            status: 400,
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
     * Method to delete the hospital
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    delete_hospital: async (req, res) => {
        try {
            // get the hospital id
            const hospitalId = req.params.hospital_id;

            // delete the hospital
            await Hospital.destroy({ where: {id: hospitalId} })
                .then(hospital => {
                    if (!hospital)
                        return res.status(404)
                            .json({
                                status: 404,
                                message: 'Unable to find the hospital'
                            });

                    return res.status(200)
                        .json({
                            status: 200,
                            message: 'Hospital deleted successfully'
                        });
                })
                .catch(err => {
                    return res.status(400)
                        .json({
                            status: 400,
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

module.exports = HospitalController;
