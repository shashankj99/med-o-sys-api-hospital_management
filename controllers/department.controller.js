const db = require('../models');

const Department = db.departments;
const ModelNotFoundException = require("../exceptions/model-not-found-exception");

const DepartmentController = {
    /**
     * Method to get all departments
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    get_all_departments: async (req, res) => {
        try {
            await Department.findAll()
                .then(department => {
                    return res.status(200)
                        .json({
                            status: 200,
                            data: department
                        });
                }).catch(err => {
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
     * Method to create a department
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    create_department: async (req, res) => {
        try {
            // get department attributes
            const departmentAttributes = {
                name: req.body.name,
                nepali_name: req.body.nepali_name
            };
            
            // transaction object
            const transaction = await db.sequelize.transaction();

            // create department
            await Department.create(departmentAttributes, {transaction})
                .then(async department => {
                    // get the array of treatment ids from mrequest
                    const treatment_ids = req.body.treatments;

                    // find all treatments by id
                    await db.treatments.findAll({where: {id: treatment_ids}, attributes: ["id"]})
                        .then(treatments => {
                            // throw not found error if array is empty
                            if (treatments.length == 0)
                                throw new ModelNotFoundException("Treatments couldn't be found");
                            
                            // add treatments to department
                            department.addTreatments(treatments);

                            // commit the transaction
                            transaction.commit();

                            return res.status(200)
                                .json({
                                    message: 'Department created successfully'
                                });
                        }).catch(err => {
                            transaction.rollback();
                            if (err.hasOwnProperty("status"))
                                return res.status(err.status)
                                    .json({
                                        message: err.message
                                    });
                            return res.status(500)
                                .json({
                                    message: err.message
                                });
                        });
                }).catch(err => {
                    transaction.rollback();
                    return res.status(500)
                        .json({
                            message: err.message
                        });
                });
        } catch (err) {
            transaction.rollback();
            return res.status(500)
                .json({
                    message: err.message
                });
        }
    },

    /**
     * Get the department detail
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    get_department_detail: async (req, res) => {
        try {
            // get the department id
            const departmentId = req.params.department_id;

            // get the department and its treatments
            await Department.findByPk(departmentId, {
                include: {
                    model: db.treatments,
                    as: "treatments",
                    attributes: ["id", "name", "nepali_name"],
                    required: false,
                    through: { attributes: [] }
                }
            })
                .then(department => {
                    // return not found error
                    if (!department)
                        throw new ModelNotFoundException("Unable to find the department");

                    return res.status(200)
                        .json({
                            status: 200,
                            data: department
                        });
                }).catch(err => {
                    return res.status(400)
                        .json({
                            status: 400,
                            message: err.message
                        });
                });
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
    },

    /**
     * Method to update the department
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    update_department: async (req, res) => {
        try {
            // get department id
            const departmentId = req.params.department_id;

            // get the department
            await Department.findByPk(departmentId)
                .then(async department => {
                    if (!department)
                        throw new ModelNotFoundException("Unable to find the department");

                    const transaction = await db.sequelize.transaction();

                    // get department attributes
                    const departmentAttributes = {
                        name: req.body.name,
                        nepali_name: req.body.nepali_name
                    };

                    // update department
                    await department.update(departmentAttributes, {transaction})
                        .then(async department => {
                            // get the array of treatment ids from mrequest
                            const treatment_ids = req.body.treatments;

                            // find all treatments by id
                            await db.treatments.findAll({where: {id: treatment_ids}, attributes: ["id"]})
                                .then(treatments => {
                                    // throw not found error if array is empty
                                    if (treatments.length == 0)
                                        throw new ModelNotFoundException("Treatments couldn't be found");
                                    
                                    // add treatments to department
                                    department.setTreatments(treatments);

                                    // commit the transaction
                                    transaction.commit();

                                    return res.status(200)
                                        .json({
                                            message: 'Department updated successfully'
                                        });
                                }).catch(err => {
                                    transaction.rollback();
                                    if (err.hasOwnProperty("status"))
                                        return res.status(err.status)
                                            .json({
                                                message: err.message
                                            });
                                    return res.status(500)
                                        .json({
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
                }).catch(err => {
                    transaction.rollback();
                    return res.status(400)
                        .json({
                            status: 400,
                            message: err.message
                        });
                });
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
    },

    /**
     * Method to delete the department
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    delete_department: async (req, res) => {
        try {
            const departmentId = req.params.department_id;

            await Department.destroy({ where: {id: departmentId} })
                .then(department => {
                    if (!department)
                        throw new ModelNotFoundException("Unable to find the department");

                    return res.status(200)
                        .json({
                            status: 200,
                            message: 'Department deleted successfully'
                        });
                }).catch(err => {
                    return res.status(400)
                        .json({
                            status: 400,
                            message: err.message
                        });
                });
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

module.exports = DepartmentController;
