const router = require('express').Router();

// route middleware
const auth = require('../middleware/auth');

// Requests
const HospitalRequest = require('../requests/hospital.request');
const DepartmentRequest = require('../requests/department.request');
const PaymentHistoryRequest = require('../requests/payment_history.request');
const DoctorRequest = require('../requests/doctor.request');
const OpdHourRequest = require("../requests/opd_hours.request");
const DoctorHourRequest = require('../requests/doctor_hour.request');
const DepartmentBedRequest = require('../requests/department_beds');
const HospitalRoomRequest = require('../requests/hospital_rooms.request');
const TreatmentRequest = require('../requests/treatment.request');

const validation_error = require('../requests/validation_error');

// controllers
const HospitalController = require('../controllers/hospital.controller');
const DepartmentController = require('../controllers/department.controller');
const PaymentHistroyController = require('../controllers/payment_history.controller');
const DoctorController = require('../controllers/doctor.controller');
const OpdHourController = require("../controllers/opd_hour.controller");
const DoctorHourController = require('../controllers/doctor_hour.controller');
const DepartmentBedController = require('../controllers/department_bed.controller');
const HospitalRoomController = require('../controllers/hospital_room.controller');
const TreatmentController = require('../controllers/treatment.controller');

router.get('/', function (req, res) {
    return res.status(200)
        .json({
            status: 200,
            success: true
        });
})

/*
 * Hospital routes
 */
router.get('/hospitals',
    HospitalController.get_all_hospitals
);

router.post('/hospital',
    HospitalRequest.create_hospital_request, validation_error,
    HospitalController.create_hospital
);

router.get('/hospital/:hospital_id', 
    auth('view hospital detail'),
    HospitalController.get_hospital_detail
);

router.put('/hospital/:hospital_id', 
    auth('edit hospital'),
    HospitalRequest.update_hospital_request, validation_error,
    HospitalController.update_hospital_detail
);

router.delete('/hospital/:hospital_id', 
    auth('delete hospital'),
    HospitalController.delete_hospital
);

router.put("/change/hospital/status/:hospital_id",
    auth("change status"),
    HospitalRequest.change_status, validation_error,
    HospitalController.change_hospital_status
);

router.put("/hospital/:hospital_id/treatments",
    auth("edit hospital"),
    HospitalRequest.hospital_treatment, validation_error,
    HospitalController.update_hospital_treatments
);

/*
 * Department routes
 */
router.get('/departments',
    DepartmentController.get_all_departments
);

router.post('/department', auth('create department'),
    DepartmentRequest.create_department, DepartmentRequest.department_treatment,
    validation_error,
    DepartmentController.create_department
);

router.get('/department/:department_id', auth('view department detail'),
    DepartmentController.get_department_detail
);

router.put('/department/:department_id', auth('edit department'),
    DepartmentRequest.update_department, DepartmentRequest.department_treatment,
    validation_error,
    DepartmentController.update_department
);

router.delete('/department/:department_id', auth('delete department'),
    DepartmentController.delete_department
);

/**
 * Payment history
 */
router.get('/hospital/:hospital_id/payments',
    auth('view payments'),
    PaymentHistroyController.get_payment_histories_of_a_hospital
);

router.post('/hospital/:hospital_id/payment',
    auth('create payment'),
    PaymentHistoryRequest.create_or_update_payment_history, validation_error,
    PaymentHistroyController.create_payment_history_for_a_hospital
);

router.get('/hospital/:hospital_id/payment/:payment_id',
    auth('view payment detail'),
    PaymentHistroyController.get_payment_detail_of_a_hospital
);

router.put('/hospital/:hospital_id/payment/:payment_id',
    auth('edit payment'),
    PaymentHistoryRequest.create_or_update_payment_history, validation_error,
    PaymentHistroyController.update_payment_history
);

router.delete('/hospital/:hospital_id/payment/:payment_id',
    auth('delete payment'),
    PaymentHistroyController.delete_payment_history
);

router.put("/change/payment/status/:payment_id",
    auth("change status"),
    PaymentHistoryRequest.change_status, validation_error,
    PaymentHistroyController.change_hospital_status
);

/**
 * Doctor routes
 */
router.get('/hospital/:hospital_id/department/:department_id/doctors', 
    auth('view doctors'),
    DoctorController.index
);

router.post('/hospital/:hospital_id/department/:department_id/doctor', 
    auth('create doctor'),
    DoctorRequest.create_doctor_request, validation_error,
    DoctorController.create
);

router.get('/hospital/:hospital_id/department/:department_id/doctor/:doctor_id',
    auth('view doctor detail'),
    DoctorController.show
);

router.put('/hospital/:hospital_id/department/:department_id/doctor/:doctor_id',
    auth('edit doctor'),
    DoctorRequest.update_doctor_request, validation_error,
    DoctorController.update
);

router.delete('/hospital/:hospital_id/department/:department_id/doctor/:doctor_id',
    auth('delete doctor'),
    DoctorController.destroy
);

router.put("/change/doctor/status/:doctor_id",
    auth("change status"),
    DoctorRequest.change_status, validation_error,
    DoctorController.change_doctor_status
);

/**
 * OPD Hour routes
 */
router.post("/hospital/:hospital_id/opd/hour",
    auth("create opd hour"),
    OpdHourRequest.create_or_update_opd_hour, validation_error,
    OpdHourController.create
);

router.get("/hospital/:hospital_id/opd/hours",
    OpdHourController.index
);

router.get("/hospital/:hospital_id/opd/hour/:opd_hour_id",
    auth("view opd hour detail"),
    OpdHourController.show
);

router.put("/hospital/:hospital_id/opd/hour/:opd_hour_id",
    auth("edit opd hour"),
    OpdHourRequest.create_or_update_opd_hour, validation_error,
    OpdHourController.update
);

router.delete("/hospital/:hospital_id/opd/hour/:opd_hour_id",
    auth("delete opd hour"),
    OpdHourController.destroy
);

/**
 * doctor hour routes
 */
router.post("/doctor/:doctor_id/hour",
    auth('create doctor hour'),
    DoctorHourRequest.create_or_update_doctor_hour, validation_error,
    DoctorHourController.create
);

router.get("/doctor/:doctor_id/hours",
    auth('view doctor hours'),
    DoctorHourController.index
);

router.get("/doctor/:doctor_id/hour/:doctor_hour_id",
    auth("view doctor hour detail"),
    DoctorHourController.show
);

router.put("/doctor/:doctor_id/hour/:doctor_hour_id",
    auth("edit doctor hour"),
    DoctorHourRequest.create_or_update_doctor_hour, validation_error,
    DoctorHourController.update
);

router.delete("/doctor/:doctor_id/hour/:doctor_hour_id",
    auth("delete doctor hour"),
    DoctorHourController.destroy
);

/**
 * Department beds
 */
router.get('/hospital/:hospital_id/department/:department_id/department/beds',
    auth("view department beds"),
    DepartmentBedController.index
);

router.post('/department/bed',
    auth("create department bed"),
    DepartmentBedRequest.create_or_update_department_bed, validation_error,
    DepartmentBedController.create
);

router.get('/hospital/:hospital_id/department/:department_id/department/bed/:id',
    auth("view department bed detail"),
    DepartmentBedController.show
);

router.put('/department/bed/:id',
    auth("edit department bed"),
    DepartmentBedRequest.create_or_update_department_bed, validation_error,
    DepartmentBedController.update
);

router.delete('/hospital/:hospital_id/department/:department_id/department/bed',
    auth("delete department bed"),
    DepartmentBedController.destroy
);

/**
 * Hospital rooms
 */
router.get('/hospital/:hospital_id/rooms',
    auth("view hospital rooms"),
    HospitalRoomController.index
);

router.post("/hospital/:hospital_id/room",
    auth("create hospital room"),
    HospitalRoomRequest.create_or_update_hospital_room, validation_error,
    HospitalRoomController.create
);

router.get('/hospital/:hospital_id/room/:id',
    auth("view hospital room detail"),
    HospitalRoomController.show
);

router.put("/hospital/:hospital_id/room/:id",
    auth("edit hospital room"),
    HospitalRoomRequest.create_or_update_hospital_room, validation_error,
    HospitalRoomController.update
);

router.delete('/hospital/:hospital_id/room/:id',
    auth("delete hospital room"),
    HospitalRoomController.destroy
);

/**
 * Treatments
 */
router.get('/treatments',
    auth("view treatments"),
    TreatmentController.index
);

router.post('/treatment',
    auth("create treatment"),
    TreatmentRequest.create_treatment, validation_error,
    TreatmentController.create
);

router.get('/treatment/:id', 
    auth("view treatment detail"),
    TreatmentController.show
);

router.put('/treatment/:id', 
    auth("edit treatment"),
    TreatmentRequest.update_treatment, validation_error,
    TreatmentController.update
);

router.delete('/treatment/:id', 
    auth("delete treatment"),
    TreatmentController.delete
);

module.exports = router;
