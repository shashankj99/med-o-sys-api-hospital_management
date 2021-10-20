const { check } = require('express-validator');

const DepartmentBedRequest = {
    create_or_update_department: [
        check("hospital_id")
            .exists().withMessage("Hospital Id can not be empty"),
        check("department_id")
            .exists().withMessage("Department Id can not be empty"),
        check("availability")
            .isIn([true, false])
            .withMessage("Availability must be either true or false"),
        check("price_per_day")
            .exists().withMessage("Price per day is required")
            .isFloat().withMessage("Price must be a numeric/decimal value")
    ]
}

module.exports = DepartmentBedRequest;