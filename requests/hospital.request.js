const { check } = require('express-validator');
const db  = require('../models');

const Hospital = db.hospitals;

const HospitalRequest = {
    /**
     * Validation request for creating hospital
     */
    create_hospital_request: [
        check('name').exists().withMessage('Name is required')
            .isAlpha("en-US", {ignore: " "}).withMessage('Name must be a string'),

        check('province_id').exists().withMessage('province is required')
            .isInt("province id must be a number"),

        check('district_id').exists().withMessage('district is required')
            .isInt("district id must be a number"),

        check('city_id').exists().withMessage('city is required')
            .isInt("city id must be a number"),

        check('type').exists().withMessage('Hospital type is required')
            .isAlpha("en-US", {ignore: " "}).withMessage("Hospital type must be a string"),

        check('no_of_beds').exists().withMessage('No of beds is required')
            .isNumeric().withMessage('No of beds must be a number'),

        check('phone_no').exists().withMessage('Phone number is required')
            .custom(async value => {
                if (value)
                    return await Hospital.findOne({ where: {phone_no: value} })
                        .then((hospital) => {
                            if (hospital)
                                return Promise.reject('Phone number has already been taken');
                        });
            }),

        check('email_address').exists().withMessage('Email address is required')
            .isEmail().withMessage('Email address must be a valid email')
            .custom(async value => {
                if (value)
                    return await Hospital.findOne({ where: {email_address: value} })
                        .then((hospital) => {
                            if (hospital)
                                return Promise.reject('Email has already been taken');
                        });
            }),

        check('website').exists().withMessage('Website is required')
            .custom(value => {
                if (value)
                    return Hospital.findOne({ where: {website: value} })
                        .then(hospital => {
                            if (hospital)
                                return Promise.reject('Website has already taken')
                        });
            }),

        check('departments').exists().withMessage('Departments are required')
            .isArray().withMessage('Departments must be an array')
    ],

    /**
     * Validation request for updating hospital
     */
    update_hospital_request: [
        check('name').exists().withMessage('Name is required')
            .isAlpha("en-US", {ignore: " "}).withMessage('Name must be a string'),

        check('province_id').exists().withMessage('province is required')
            .isInt("province id must be a number"),

        check('district_id').exists().withMessage('district is required')
            .isInt("district id must be a number"),

        check('city_id').exists().withMessage('city is required')
            .isInt("city id must be a number"),

        check('type').exists().withMessage('Hospital type is required')
            .isAlpha("en-US", {ignore: " "}).withMessage("Hospital type must be a string"),

        check('phone_no').exists().withMessage('Phone number is required'),

        check('no_of_beds').exists().withMessage('No of beds is required')
            .isNumeric().withMessage('No of beds must be a number'),

        check('email_address').exists().withMessage('Email address is required')
            .isEmail().withMessage('Email address must be a valid email'),

        check('departments').exists().withMessage('Departments are required')
            .isArray().withMessage('Departments must be an array'),

        async function (req, res, next) {
            const hospitalId = req.params.hospital_id;

            await Hospital.findOne({ where: {phone_no: req.body.phone_no} })
                .then(hospital => {
                    if (!hospital)
                        return next();

                    if (hospital.id !== parseInt(hospitalId))
                        return res.status(422)
                            .json({
                                status: 422,
                                errors: [
                                    {phone_no: "Phone number has already been taken"}
                                ]
                            });
                    return next();
                }).catch(err => {return next()});
        },

        async function (req, res, next) {
            const hospitalId = req.params.hospital_id;

            await Hospital.findOne({ where: {email_address: req.body.email_address} })
                .then(hospital => {
                    if (!hospital)
                        return next();

                    if (hospital.id !== parseInt(hospitalId))
                        return res.status(422)
                            .json({
                                status: 422,
                                errors: [
                                    {email_address: "Email address has already been taken"}
                                ]
                            });
                    return next();
                }).catch(err => {return next()});
        },

        async function (req, res, next) {
            const hospitalId = req.params.hospital_id;

            await Hospital.findOne({ where: {website: req.body.website} })
                .then(hospital => {
                    if (!hospital)
                        return next();

                    if (hospital.id !== parseInt(hospitalId))
                        return res.status(422)
                            .json({
                                status: 422,
                                errors: [
                                    {website: "Website has already been taken"}
                                ]
                            });

                    return next();
                }).catch(err => {return next()});
        }
    ],

    change_status: [
        check("status").exists().withMessage("Status cannot be empty")
    ],
};

module.exports = HospitalRequest;
