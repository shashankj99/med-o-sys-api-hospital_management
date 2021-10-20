const db = require('../models');
const AuthUser = require('../facade/auth_user');
const ModelNotFoundException = require("../exceptions/model-not-found-exception");
const ServiceException = require('../exceptions/service.exception');

const DepartmentBedController = {

    /**
     * @description Method to view all department beds
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    index: async ( req, res ) => {

        try {

            const { hospital_id, department_id } = req.params;

            const filterAttributes = {
                hospital_id, 
                department_id
            }

            // add availability to query data if present in request
            if ( req.query.availability )
                filterAttributes.availability = req.query.availability;

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (hospital_id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            await db.departmentBeds.findAll({
                where: filterAttributes
            })
            .then(departmentBeds => {
                return res.status(200)
                    .json({
                        data: departmentBeds
                    });
            })
            .catch(err => {
                return res.status(500)
                    .json({
                        message: err.message
                    });
            })

        } catch (err) {

            return res.status(500)
                .json({
                    message: err.message
                });

        }

    },

    /**
     * @description Method to create department beds
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    create: async (req, res) => {
        try {
            // get attributes
            const attributes = {
                hospital_id: req.body.hospital_id,
                department_id: req.body.department_id,
                availability: req.body.availability,
                price_per_day: req.body.price_per_day
            };

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (req.body.hospital.id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // get hospital and its associated department info
            const hospital = await db.hospitals.findByPk(req.body.hospital_id, {
                include: {
                    model: db.departments,
                    as: "departments",
                    attributes: ["id", "no_of_beds"],
                    through: { attributes: [] },
                    where: {
                        id: req.body.department_id
                    },
                    required: false,
                    include: {
                        model: db.departmentBeds,
                        as: "department_beds",
                        attributes: ["id", "bed_no"],
                        limit: 1,
                        order: [['id', 'desc']]
                    }
                },
                attributes: ["id"]
            });

            if ( !hospital || hospital.departments.length < 1 )
                throw new ModelNotFoundException("Unable to find the hospital &/or department");

            // add bed_no to attributes object
            attributes.bed_no = (hospital.departments[0].department_beds.length < 1)
                ? 1
                : hospital.departments[0].department_beds[0].bed_no + 1;

            // create department bed
            await db.departmentBeds.create(attributes)
                .then( async () => {
                    // increase the bed count of the department by 1
                    hospital.departments[0].no_of_beds += 1;

                    // save the db change
                    await hospital.departments[0].save();
                })
                .then (() => {
                    return res.status(200)
                        .json({
                            message: "Department bed added successfully"
                        })
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            message: err.message
                        });
                });
        } catch (err) {

            if ( err.hasOwnProperty("status") )
                return res.status(err.status)
                    .json({
                        message: err.message
                    });

            return res.status(500)
                .json({
                    message: err.message
                });
        }
    },

    /**
     * @description Method to get departmnet bed detail
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    show: async ( req, res ) => {

        try {

            const { hospital_id, department_id, id } = req.params;

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (hospital.id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            await db.departmentBeds.findOne({
                where: { id, hospital_id, department_id }
            })
            .then(departmentBed => {
                if ( !departmentBed )
                    throw new ModelNotFoundException("Unable to find the department bed");

                return res.status(200)
                    .json({
                        data: departmentBed
                    });
            })
            .catch(err => {
                if ( err.hasOwnProperty("status") )
                    return res.status(err.status)
                        .json({
                            message: err.message
                        });

                return res.status(500)
                    .json({
                        message: err.message
                    });
            })

        } catch (err) {

            if ( err.hasOwnProperty("status") )
                return res.status(err.status)
                    .json({
                        message: err.message
                    });

            return res.status(500)
                .json({
                    message: err.message
                });
        }

    },

    /**
     * @description Method to update the department bed
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    update: async ( req, res ) => {

        try {

            const id = req.params.id,
                attributes = {
                    hospital_id: req.body.hospital_id,
                    department_id: req.body.department_id,
                    availability: req.body.availability,
                    price_per_day: req.body.price_per_day
                };

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (req.body.hospital.id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // get the department bed
            const departmentBed = await db.departmentBeds.findOne({
                where: {
                    id,
                    hospital_id: req.body.hospital_id,
                    department_id: req.body.department_id
                }
            });

            // throw not found error
            if ( !departmentBed )
                throw new ModelNotFoundException("Unable to find the department bed");

            // update the department bed data
            await departmentBed.update(attributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            message: "Department bed updated successfully"
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            message: err.message
                        });
                });

        } catch (err) {

            if ( err.hasOwnProperty("status") )
                return res.status(err.status)
                    .json({
                        message: err.message
                    });

            return res.status(500)
                .json({
                    message: err.message
                });
        }

    },
    
    /**
     * @description Method to delete the last department bed
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    destroy: async ( req, res ) => {

        try {

            const { hospital_id, department_id } = req.params;

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (hospital.id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // get hospital and its associated department info
            const hospital = await db.hospitals.findByPk(hospital_id, {
                include: {
                    model: db.departments,
                    as: "departments",
                    attributes: ["id", "no_of_beds"],
                    through: { attributes: [] },
                    where: {
                        id: department_id
                    },
                    required: false,
                    include: {
                        model: db.departmentBeds,
                        as: "department_beds",
                        attributes: ["id", "availability"],
                        limit: 1,
                        order: [['id', 'desc']]
                    }
                },
                attributes: ["id"]
            });

            if ( !hospital || hospital.departments.length < 1 )
                throw new ModelNotFoundException("Unable to find the hospital &/or department");

            if ( !hospital.departments[0].department_beds[0].availability )
                throw new ServiceException(403, "You cannot delete the last department bed if it is unavailable");

            // increase the bed count of the department by 1
            hospital.departments[0].no_of_beds -= 1;

            // delete the last department bed
            await hospital.departments[0].department_beds[0].destroy()
                .then(async () => {
                    // save the db change
                    await hospital.departments[0].save();

                    return res.status(200)
                        .json({
                            message: "Department bed deleted successfully"
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            message: err.message
                        });
                });

        } catch (err) {

            if ( err.hasOwnProperty("status") )
                return res.status(err.status)
                    .json({
                        message: err.message
                    });

            return res.status(500)
                .json({
                    message: err.message
                });
        }

    }

};

module.exports = DepartmentBedController;