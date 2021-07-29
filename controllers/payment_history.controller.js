const db = require("../models");
const AuthUser = require("../facade/auth_user");

const PaymentHistory = db.paymentHistories;
const Hospital = db.hospitals;
const ModelNotFoundException = require("../exceptions/model-not-found-exception");
const paymentHistoryAttributes = require("../services/payment_history_attributes");

const PaymentHistroyController = {
    /**
     * Method to get all the payment history of a hospital
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    get_payment_histories_of_a_hospital: async (req, res) => {
        const hospitalId = req.params.hospital_id;

        if (AuthUser.hospital()) {
            if (hospitalId !== AuthUser.hospital().hospital_id)
                return res.status(403)
                    .json({
                        status: 403,
                        message: 'Forbidden'
                    });
        }

        await PaymentHistory.findAll({ 
            where: {
                paymentable_id: hospitalId,
                paymentable_type: 'Hospital'
            },
            attributes: [
                'id', 'amount', 'payment_method', 'valid_from', 'valid_till', 'status',
                [
                    db.sequelize.fn('date_format', db.sequelize.col('created_at'), '%Y-%m-%d %H:%i:%s'),
                    'created_at'
                ]
            ] 
        }).then(payments => {
                return res.status(200)
                    .json({
                        status: 200,
                        data: payments
                    });
            }).catch(err => {
                return res.status(500)
                    .json({
                        status: 500,
                        message: err.message
                    });
            });
    },

    /**
     * Method to create payment
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    create_payment_history_for_a_hospital: async (req, res) => {
        try {
            const hospitalId = req.params.hospital_id;

            // check if user is permitted
            if (AuthUser.hospital()) {
                if (hospitalId !== AuthUser.hospital().hospital_id)
                    return res.status(403)
                        .json({
                            status: 403,
                            message: 'Forbidden'
                        });
            }

            // get hospital
            const hospital = await Hospital.findByPk(hospitalId);

            // throw error
            if (!hospital)
                throw new ModelNotFoundException('Unable to find the hospital');

            // create payment history
            await hospital.createPaymentHistory(paymentHistoryAttributes(req.body));

            return res.status(200)
                .json({
                    status: 200,
                    message: 'Payment completed successfully'
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
     * Get payment history
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    get_payment_detail_of_a_hospital: async (req, res) => {
        try {
            const hospitalId = req.params.hospital_id,
                paymentId = req.params.payment_id;

            // check if user is permitted
            if (AuthUser.hospital()) {
                if (hospitalId !== AuthUser.hospital().hospital_id)
                    return res.status(403)
                        .json({
                            status: 403,
                            message: 'Forbidden'
                        });
            }

            // get payment history
            const paymentHistory = await PaymentHistory.findOne({
                where: {
                    id: paymentId,
                    paymentable_id: hospitalId,
                    paymentable_type: 'Hospital',
                },
                attributes: [
                    'id', 'amount', 'payment_method', 'valid_from', 'valid_till', 'status',
                    [
                        db.sequelize.fn('date_format', db.sequelize.col('created_at'), '%Y-%m-%d %H:%i:%s'),
                        'created_at'
                    ]
                ]
            });

            // throw error
            if (!paymentHistory)
                throw new ModelNotFoundException('Unable to find the payment history');

            return res.status(200)
                .json({
                    status: 200,
                    data: paymentHistory
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
     * Method to update the payment detail
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    update_payment_history: async(req, res) => {
        try {
            const hospitalId = req.params.hospital_id,
            paymentId = req.params.payment_id;

            // check if user is permitted
            if (AuthUser.hospital()) {
                if (hospitalId !== AuthUser.hospital().hospital_id)
                    return res.status(403)
                        .json({
                            status: 403,
                            message: 'Forbidden'
                        });
            }

            // get payment history
            const paymentHistory = await PaymentHistory.findOne({
                where: {
                    id: paymentId,
                    paymentable_id: hospitalId,
                    paymentable_type: 'Hospital',
                }
            });

            // throw error
            if (!paymentHistory)
                throw new ModelNotFoundException('Unable to find the payment history');

            // update payment
            await paymentHistory.update(paymentHistoryAttributes(req.body));

            return res.status(200)
                .json({
                    status: 200,
                    message: 'Payment updated successfully'
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
     * Method to delete the payment
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    delete_payment_history: async(req, res) => {
        try {
            const hospitalId = req.params.hospital_id,
            paymentId = req.params.payment_id;

            // check if user is permitted
            if (AuthUser.hospital()) {
                if (hospitalId !== AuthUser.hospital().hospital_id)
                    return res.status(403)
                        .json({
                            status: 403,
                            message: 'Forbidden'
                        });
            }

            // get payment history
            const paymentHistory = await PaymentHistory.destroy({
                where: {
                    id: paymentId,
                    paymentable_id: hospitalId,
                    paymentable_type: 'Hospital',
                }
            });

            // throw error
            if (!paymentHistory)
                throw new ModelNotFoundException('Unable to find the payment history');

            return res.status(200)
                .json({
                    status: 200,
                    message: 'Payment deleted successfully'
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
     * Method to change hospital status
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
     change_hospital_status: async (req, res) => {
        try {
            const paymentId = req.params.payment_id;

            // get payment history by id
            const paymentHistory = await PaymentHistory.findByPk(paymentId);

            if (!paymentHistory)
                throw new ModelNotFoundException("unable to find the payment history");

            // change paymentHistory status
            await paymentHistory.update({ status: req.body.status })
                .then(() => {
                    return res.status(200)
                        .json({
                            status: 200,
                            message: `Status updated to ${req.body.status}`
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            status: 500,
                            message: err.message
                        });
                })
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

module.exports = PaymentHistroyController;
