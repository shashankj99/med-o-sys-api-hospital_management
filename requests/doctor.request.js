const { check } = require("express-validator")

const Doctor = require("../models").doctors;

const DoctorRequest = {
    create_doctor_request: [
        check("reg_no").exists().withMessage("Registration number cannot be null")
            .isInt().withMessage("Registration number must be an integer")
            .custom(async value => {
                return await Doctor.findOne({ where: {reg_no: value} })
                    .then((doctor) => {
                        if (doctor)
                            return Promise.reject('Registration number has already been taken');
                    })
            }),

        check('email_address').exists().withMessage('Email address is required')
            .isEmail().withMessage('Email address must be a valid email')
            .custom(async value => {
                return await Doctor.findOne({ where: {email_address: value} })
                    .then((doctor) => {
                        if (doctor)
                            return Promise.reject('Email Address has already been taken');
                    })
            }
        ),

        check("degree").exists().withMessage("Degree cannot be null"),

        check("speciality").exists().withMessage("Speciality is required")
    ],

    update_doctor_request: [
        check("reg_no").exists().withMessage("Registration number cannot be null")
            .isInt().withMessage("Registration number must be an integer"),

        check('email_address').exists().withMessage('Email address is required')
            .isEmail().withMessage('Email address must be a valid email'),

        async function (req, res, next) {
            const doctorId = req.params.doctor_id;

            await Doctor.findOne({ where: {reg_no: req.body.reg_no} })
                .then(doctor => {
                    if (!doctor)
                        return next();

                    if (doctor.id !== parseInt(doctorId))
                        return res.status(422)
                            .json({
                                status: 422,
                                errors: [
                                    {reg_no: "Registration number has already been taken"}
                                ]
                            });
                    return next();
                }).catch(err => {return next()});
        },

        async function (req, res, next) {
            const doctorId = req.params.doctor_id;

            await Doctor.findOne({ where: {email_address: req.body.email_address} })
                .then(doctor => {
                    if (!doctor)
                        return next();

                    if (doctor.id !== parseInt(doctorId))
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
    ]
};

module.exports = DoctorRequest;