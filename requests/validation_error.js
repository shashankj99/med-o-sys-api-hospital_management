const { validationResult } = require('express-validator');

const validation_error = (req, res, next) =>
{
    // get validation errors
    const errors = validationResult(req);

    const extractedErrors = [];

    // map through the errors and get the error param and error message
    errors.array().map(error => extractedErrors.push({[error.param]: error.msg}));

    // return error if exists
    if (errors.array().length > 0)
        return res.status(422)
            .json({
                status: 422,
                errors: extractedErrors
            });

    // else continue the request
    next();
}

module.exports = validation_error;
