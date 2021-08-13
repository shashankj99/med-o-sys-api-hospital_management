const router = require('express').Router();

// route middleware
const auth = require('../middleware/auth');

// Requests
const HospitalRequest = require('../requests/hospital.request');
const DepartmentRequest = require('../requests/department.request');
const PaymentHistoryRequest = require('../requests/payment_history.request');
const DoctorRequest = require('../requests/doctor.request');
const OpdHourRequest = require("../requests/opd_hours.request");

const validation_error = require('../requests/validation_error');

// controllers
const HospitalController = require('../controllers/hospital.controller');
const DepartmentController = require('../controllers/department.controller');
const PaymentHistroyController = require('../controllers/payment_history.controller');
const DoctorController = require('../controllers/doctor.controller');
const OpdHourController = require("../controllers/opd_hour.controller");

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
    auth('view hospitals'),
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

/*
 * Department routes
 */
router.get('/departments',
    DepartmentController.get_all_departments
);

router.post('/department', auth('create department'),
    DepartmentRequest.create_department, validation_error,
    DepartmentController.create_department
);

router.get('/department/:department_id', auth('view department detail'),
    DepartmentController.get_department_detail
);

router.put('/department/:department_id', auth('edit department'),
    DepartmentRequest.update_department, validation_error,
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
    DoctorController.change_hospital_status
);

/**
 * OPD Hour routes
 */
router.post("/hospital/:hospital_id/opd/hour",
    auth("create opd hour"),
    OpdHourRequest.create_or_update_opd_hour, validation_error,
    OpdHourController.create
);
1
router.get("/hospital/:hospital_id/opd/hours",
    auth("view opd hours"),
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

module.exports = router;
