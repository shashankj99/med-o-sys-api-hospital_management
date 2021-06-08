const db = require('../models');
const AuthUser = require('../facade/auth_user');

const Hospital = db.hospitals;

const HospitalController = {

    /**
     * Method to view the list of hospitals
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    get_all_hospitals: async (req, res) => {
        try {
            // forbid users if not super admin
            if (!AuthUser.has_role(['super admin']))
                return res.status(401)
                    .json({
                        status: 401,
                        message: 'Forbidden'
                    });

            // get all hospitals
            await Hospital.findAll()
                .then(response => {
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

            // create hospital
            await Hospital.create(hospitalAttributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            status: 200,
                            message: 'Hospital created successfully'
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
     * Method to get the detail of a hospital
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    get_hospital_detail: async (req, res) => {
        try {
            // get hospital id
            let hospitalId = req.params.hospital_id;

            // check if user is super admin or not
            if (!AuthUser.has_role(['super admin'])) {
                // check if user is associated to a hospital or not
                if (!AuthUser.hospital())
                    // forbid user if not associated
                    return res.status(401)
                        .json({
                            status: 401,
                            message: 'Forbidden'
                        });

                // get the hospital id from the AuthUser facade
                hospitalId = AuthUser.hospital().hospital_id;
            }

            // get the required hospital
            await Hospital.findByPk(hospitalId)
                .then(hospital => {
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

            // check if user is super admin or not
            if (!AuthUser.has_role(['super admin'])) {
                // check if user is associated with a hospital
                if (!AuthUser.hospital())
                    // forbid user if not associated
                    return res.status(401)
                        .json({
                            status: 401,
                            message: 'Forbidden'
                        });

                // get the hospital id from the auth user facade
                hospitalId = AuthUser.hospital().hospital_id;
            }

            // get the hospital
            const hospital = await Hospital.findByPk(hospitalId);

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
            await hospital.update(hospitalAttributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            status: 200,
                            message: 'Hospital updated successfully'
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
    },

    /**
     * Method to delete the hospital
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    delete_hospital: async (req, res) => {
        try {
            // forbid users if not super admin
            if (!AuthUser.has_role(['super admin']))
                return res.status(401)
                    .json({
                        status: 401,
                        message: 'Forbidden'
                    });

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