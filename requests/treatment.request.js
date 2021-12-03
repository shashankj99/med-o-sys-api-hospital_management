const { check } = require('express-validator');
const db = require('../models');

const Treatment = db.treatments;

const TreatmentRequest = {
    create_treatment: [
        check('name').exists().withMessage('Name is required')
            .isAlpha("en-US", { ignore: " " }).withMessage('Name must be a string')
            .custom(async value => {
                if (value)
                    return await Treatment.findOne({where: {name: value}})
                        .then(treatment => {
                            if (treatment)
                                return Promise.reject('This name has already been taken')
                        });
            }),

        check('nepali_name').exists().withMessage('Nepali name is required')
            .isString().withMessage('Nepali name must be string')
            .custom(async value => {
                if (value)
                    return await Treatment.findOne({ where: {nepali_name: value} })
                        .then(treatment => {
                            if (treatment)
                                return Promise.reject('This nepali name has already been taken')
                        });
            }),

        check("type").exists().withMessage("Treatement type is required")
            .isIn(["general", "consulting", "surgical", "therapy"])
            .withMessage("Treatment type must be either general, consulting, surgical or therapy"),

        check("price").exists().withMessage("Treatement price is required")
            .isFloat().withMessage("Treatment price must be a decimal number")
    ],

    update_treatment: [
        check('name').exists().withMessage('Name is required')
            .isAlpha("en-US", { ignore: " " }).withMessage('Name must be a string'),

        check('nepali_name').exists().withMessage('Nepali name is required')
            .isString().withMessage('Nepali name must be string'),

        async function (req, res, next) {
            const treatmentId = req.params.id;

            await Treatment.findOne({ where: {name: req.body.name} })
                .then(treatment => {
                    if (!treatment)
                        return next();

                    if (treatment.id !== parseInt(treatmentId))
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
            const treatmentId = req.params.id;

            await Treatment.findOne({ where: {nepali_name: req.body.nepali_name} })
                .then(treatment => {
                    if (!treatment)
                        return next();

                    if (treatment.id !== parseInt(treatmentId))
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

        check("type").exists().withMessage("Treatement type is required")
            .isIn(["general", "consulting", "surgical", "therapy"])
            .withMessage("Treatment type must be either general, consulting, surgical or therapy"),

        check("price").exists().withMessage("Treatement price is required")
            .isFloat().withMessage("Treatment price must be a decimal number")
    ]
};

module.exports = TreatmentRequest;