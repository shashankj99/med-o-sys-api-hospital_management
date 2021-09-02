const { check } = require("express-validator");

const PaymentHistoryRequest = {
    create_or_update_payment_history: [
        check('amount').exists().withMessage('Amount cannot be empty')
            .isFloat().withMessage('Amount must be a decimal number'),

        check('payment_method').exists().withMessage('Payment method cannot be empty')
            .isAlpha("en-US", { ignore: " " }).withMessage('Payment method must be a string')
    ],

    change_status: [
        check("status").exists().withMessage("Status cannot be empty")
    ],
}

module.exports = PaymentHistoryRequest;
