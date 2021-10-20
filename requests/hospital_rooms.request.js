const { check } = require('express-validator');

const HospitalRoomRequest = {
    create_or_update_hospital_room: [
        check("room_no")
            .exists().withMessage("Room number can not be empty")
            .isInt().withMessage("Room number must be an integer"),
        check("room_type")
            .exists().withMessage("Room Type can not be empty")
            .isIn(['general', 'sharing', 'deluxe', 'vip'])
            .withMessage("Invalid Room Type"),
        check("availability")
            .isIn([true, false])
            .withMessage("Availability must be either true or false"),
        check("price_per_day")
            .exists().withMessage("Price per day is required")
            .isFloat().withMessage("Price must be a numeric/decimal value")
    ]
}

module.exports = HospitalRoomRequest;