const { check } = require('express-validator');
const db = require('../models');

const Department = db.departments;

const DepartmentRequest = {
    create_department: [
        check('name').exists().withMessage('Name is required')
            .isString().withMessage('Name must be a string')
            .custom(async value => {
                return await Department.findOne({where: {name: value}})
                    .then(department => {
                        if (department)
                            return Promise.reject('This name has already been taken')
                    });
            }),

        check('nepali_name').exists().withMessage('Nepali name is required')
            .isString().withMessage('Nepali name is required')
            .custom(async value => {
                return await Department.findOne({ where: {nepali_name: value} })
                    .then(department => {
                        if (department)
                            return Promise.reject('This nepali name has already been taken')
                    });
            })
    ],

    update_department: [
        check('name').exists().withMessage('Name is required')
            .isString().withMessage('Name must be a string'),

        check('nepali_name').exists().withMessage('Nepali name is required')
            .isString().withMessage('Nepali name is required'),

        async function (req, res, next) {
            const departmentId = req.params.department_id;

            await Department.findOne({ where: {name: req.body.name} })
                .then(department => {
                    if (!department)
                        return next();

                    if (department.id !== parseInt(departmentId))
                        return res.status(422)
                            .json({
                                status: 422,
                                errors: [
                                    {name: "This name has already been taken"}
                                ]
                            });
                    return next();
                }).catch(err => {return next()});
        },

        async function (req, res, next) {
            const departmentId = req.params.department_id;

            await Department.findOne({ where: {nepali_name: req.body.nepali_name} })
                .then(department => {
                    if (!department)
                        return next();

                    if (department.id !== parseInt(departmentId))
                        return res.status(422)
                            .json({
                                status: 422,
                                errors: [
                                    {nepali_name: "This nepali name has already been taken"}
                                ]
                            });
                    return next();
                }).catch(err => {return next()});
        },
    ]
};

module.exports = DepartmentRequest;