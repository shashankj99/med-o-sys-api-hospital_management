const { check } = require("express-validator");

const OpdHourRequest = {
    create_or_update_opd_hour: [
        check("day").exists().withMessage("Day can not be empty")
            .isAlpha().withMessage("Day can not contain number"),

        check("opening_time").exists().withMessage("opening time can not be empty"),

        check("closing_time").exists().withMessage("Closing time can not be empty")
    ]
}

module.exports = OpdHourRequest;