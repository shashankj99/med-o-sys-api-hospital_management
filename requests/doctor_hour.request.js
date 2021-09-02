const { check } = require("express-validator");

const DoctorHourRequest = {
    create_or_update_doctor_hour: [
        check("day").exists().withMessage("Day can not be empty")
            .isAlpha("en-US", { ignore: " " }).withMessage("Day can not contain number"),

        check("available_from").exists().withMessage("Available from can not be empty"),

        check("available_to").exists().withMessage("Available to can not be empty")
    ]
}

module.exports = DoctorHourRequest;