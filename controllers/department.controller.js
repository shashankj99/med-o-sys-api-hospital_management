const db = require('../models');

const Department = db.departments;

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

            // create department
            await Department.create(departmentAttributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            status: 200,
                            message: 'Department created successfully'
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
     * Get the department detail
     * @param req
     * @param res
     * @returns {Promise<any>}
     */
    get_department_detail: async (req, res) => {
        try {
            // get the department id
            const departmentId = req.params.department_id;

            // get the department
            await Department.findByPk(departmentId)
                .then(department => {
                    // return not found error
                    if (!department)
                        return res.status(404)
                            .json({
                                status: 404,
                                message: 'Unable to find the department'
                            });

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
                    // get department attributes
                    const departmentAttributes = {
                        name: req.body.name,
                        nepali_name: req.body.nepali_name
                    };

                    // update department
                    await department.update(departmentAttributes)
                        .then(() => {
                            return res.status(200)
                                .json({
                                    status: 200,
                                    message: 'Department updated successfully'
                                });
                        }).catch(err => {
                            return res.status(400)
                                .json({
                                    status: 400,
                                    message: err.message
                                });
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
                        return res.status(404)
                            .json({
                                status: 404,
                                message: 'Unable to find any departments'
                            });

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
            return res.status(500)
                .json({
                    status: 500,
                    message: err.message
                });
        }
    }
};

module.exports = DepartmentController;
