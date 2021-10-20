const db = require("../models");
const AuthUser = require('../facade/auth_user');
const ModelNotFoundException = require("../exceptions/model-not-found-exception");
const ServiceException = require("../exceptions/service.exception");

const HospitalRoomController = {

    /**
     * @description Method to list all hospital rooms
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    index: async (req, res) => {

        try {

            const filterAttributes = {
                hospital_id: req.params.hospital_id
            };

            if ( req.query.availability )
                filterAttributes.availability = req.query.hospital_id;

            if ( req.query.room_type )
                filterAttributes.room_type = req.query.room_type;

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (req.params.hospital_id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // find all hospital rooms
            await db.hospitalRooms.findAll({
                where: filterAttributes
            })
            .then(hospitalRooms => {
                return res.status(200)
                    .json({
                        data: hospitalRooms
                    });
            })
            .catch(err => {
                return res.status(500)
                    .json({
                        message: err.message
                    });
            })

        } catch (err) {

            if ( err.hasOwnProperty("status") )
                return res.status(err.status)
                    .json({
                        message: err.message
                    });

            return res.status(500)
                .json({
                    message: err.message
                });

        }

    },

    /**
     * @description Method to create hospital rooms
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    create: async (req, res) => {

        try {
            
            // hospital room attributes
            const attributes = {
                hospital_id: req.params.hospital_id,
                room_no: req.body.room_no,
                room_type: req.body.room_type,
                availability: req.body.availability,
                price_per_day: req.body.price_per_day
            };

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (req.params.hospital_id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // fetch hospital by id
            const hospital = db.hospitals.findByPk(req.params.hospital_id, {
                attributes: ["id"]
            });

            // throw not found error
            if ( !hospital )
                throw new ModelNotFoundException("Unable to find the hospital");

            // create hospital rooms
            await db.hospitalRooms.create(attributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            message: "Hospital room created successfully"
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            message: err.message
                        });
                });

        } catch (err) {

            if ( err.hasOwnProperty("status") )
                return res.status(err.status)
                    .json({
                        message: err.message
                    });

            return res.status(500)
                .json({
                    message: err.message
                });

        }

    },

    /**
     * @description Method to get the hospital room detail
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    show: async (req, res) => {

        try {

            const {hospital_id, id} = req.params;

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (req.params.hospital_id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            await db.hospitalRooms.findOne({
                where: { id, hospital_id }
            })
            .then(hospitalRoom => {
                if (!hospitalRoom)
                    throw new ModelNotFoundException("Unable to find the hospital room");

                return res.status(200)
                    .json({
                        data: hospitalRoom
                    });
            })
            .catch(err => {
                if ( err.hasOwnProperty("status") )
                    return res.status(err.status)
                        .json({
                            message: err.message
                        });

                return res.status(200)
                    .json({
                        data: hospitalRoom
                    });
            });

        } catch (err) {

            if ( err.hasOwnProperty("status") )
                return res.status(err.status)
                    .json({
                        message: err.message
                    });

            return res.status(500)
                .json({
                    message: err.message
                });

        }

    },

    /**
     * @description Method to update the hospital room
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    update: async (req, res) => {

        try {

            const {hospital_id, id} = req.params;

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (req.params.hospital_id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // hospital room attributes
            const attributes = {
                room_no: req.body.room_no,
                room_type: req.body.room_type,
                availability: req.body.availability,
                price_per_day: req.body.price_per_day
            };

            // get hospital room by id
            const hospitalRoom = await db.hospitalRooms.findOne({
                where: { id, hospital_id }
            });

            // throw not found error
            if ( !hospitalRoom )
                throw new ModelNotFoundException("Unable to find the hospital room");

            await hospitalRoom.update(attributes)
                .then(() => {
                    return res.status(200)
                        .json({
                            message: "Hospital room updated successfully"
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            message: err.message
                        });
                });

        } catch (err) {

            if ( err.hasOwnProperty("status") )
                return res.status(err.status)
                    .json({
                        message: err.message
                    });

            return res.status(500)
                .json({
                    message: err.message
                });

        }

    },

    /**
     * @description Method to delete the hospital room
     * @param {*} req 
     * @param {*} res 
     * @returns 
     */
    destroy: async (req, res) => {

        try {

            const {hospital_id, id} = req.params;

            // check if user is hospital admin 
            if (AuthUser.hospital()) {
                if (req.params.hospital_id !== AuthUser.hospital().hospital_id)
                    throw new ServiceException(403, "Forbidden");
            }

            // get hospital room by id
            const hospitalRoom = await db.hospitalRooms.findOne({
                where: { id, hospital_id }
            });

            // throw not found error
            if ( !hospitalRoom )
                throw new ModelNotFoundException("Unable to find the hospital room");

            // delete hospital room
            await hospitalRoom.destroy()
                .then(() => {
                    return res.status(200)
                        .json({
                            message: "Hospital room deleted successfully"
                        });
                })
                .catch(err => {
                    return res.status(500)
                        .json({
                            message: err.message
                        });
                });

        } catch (err) {

            if ( err.hasOwnProperty("status") )
                return res.status(err.status)
                    .json({
                        message: err.message
                    });

            return res.status(500)
                .json({
                    message: err.message
                });

        }

    }

};

module.exports = HospitalRoomController;