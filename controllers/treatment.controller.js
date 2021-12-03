const ModelNotFoundException = require("../exceptions/model-not-found-exception");
const db = require("../models");

const TreatmentController = {

    /**
     * @description Method to get all treatments
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    index: async (req, res) => {

        try {

            // get all treatments
            await db.treatments.findAll()
                .then(treatments => {
                    return res.status(200)
                        .json({
                            data: treatments
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            data: err.message
                        });
                });

        } catch (err) {
            return res.status(500)
                .json({
                    message: err.message
                });
        }

    },

    /**
     * @description Method to create treatment
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    create: async (req, res) => {

        try {

            const attributes = {
                name: req.body.name,
                nepali_name: req.body.nepali_name,
                type: req.body.type,
                price: req.body.price
            };

            await db.treatments.create(attributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            message: "Treatment added successfully"
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            message: err.message
                        });
                });

        } catch (err) {
            return res.status(500)
                .json({
                    message: err.message
                });
        }

    },

    /**
     * @description Method to view treatment detail
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    show: async(req, res) => {
        try {
            // get treatment id
            const id = req.params.id;
            
            // fetch treatment data from DB
            await db.treatments.findByPk(id)
                .then(treatment => {
                    if (!treatment)
                        throw new ModelNotFoundException("Unable to find the treatment");

                    return res.status(200)
                        .json({
                            data: treatment
                        });
                }).catch(err => {
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
        } catch (err) {
            return res.status(500)
                .json({
                    message: err.message
                });
        }
    },

    /**
     * @description Method to update the treatment
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    update: async (req, res) => {
        try {
            // get treatment id
            const id = req.params.id;

            // fetch treatment by id
            await db.treatments.findByPk(id)
                .then(treatment => {
                    // throw not found exception if doesn't exist
                    if (!treatment)
                        throw new ModelNotFoundException("unable to find the treatment");
                    
                    // return treatment if exists
                    return treatment;
                })
                .then(treatment => {
                    // treatment attributes
                    const attributes = {
                        name: req.body.name,
                        nepali_name: req.body.nepali_name,
                        type: req.body.type,
                        price: req.body.price
                    };

                    // update treatment
                    treatment.update(attributes);

                    return res.status(200)
                        .json({
                            message: "Treatment updated successfully"
                        });
                })
                .catch(err => {
                    if (err.hasOwnProperty("status"))
                        return res.status(err.status)
                            .json({
                                message: err.message
                            });

                    return res.status(200)
                        .json({
                            message: err.message
                        });
                });
        } catch (err) {
            return res.status(500)
                .json({
                    message: err.message
                });
        }
    },

    /**
     * @description Method to delete the treatment
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    delete: async (req, res) => {
        try {
            // get treatment id
            const id = req.params.id;

            // delete the treatment if exists
            await db.treatments.destroy({where: {id}})
                .then(treatment => {
                    if (!treatment)
                        throw new ModelNotFoundException("Unable to find the treatment");

                    return res.status(200)
                        .json({
                            message: "Treatment deleted successfully"
                        })
                })
                .catch(err => {
                    if (err.hasOwnProperty("status"))
                        return res.status(err.status)
                            .json({
                                message: err.message
                            });

                    return res.status(200)
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
    }

};

module.exports = TreatmentController;