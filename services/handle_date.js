const moment = require("moment");
/**
 * Handle date service
 */
const HandleDate = {
    /**
     * Method to get the 
     * @param {*} activeDurationInYears 
     * @returns array
     */
    valid_from_till: (activeDurationInYears) => {
        const validFrom = moment().format("Y-M-D h:mm:ss"),
            validTill = moment().add(activeDurationInYears, "years").format("Y-M-D h:mm:ss");

        return [validFrom, validTill];
    }
};

module.exports = HandleDate;