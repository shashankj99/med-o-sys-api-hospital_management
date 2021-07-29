const { check } = require("express-validator");

const PaymentHistoryRequest = {
    create_or_update_payment_history: [
        check('amount').exists().withMessage('Amount cannot be empty')
            .isFloat({ min: 100000 }).withMessage('Amount must be a decimal number and 100,000 (NRs) in minimum'),

        check('payment_method').exists().withMessage('Payment method cannot be empty')
            .isString().withMessage('Payment method must be a string')
    ],

    change_status: [
        check("status").exists().withMessage("Status cannot be empty")
    ],
}

module.exports = PaymentHistoryRequest;
