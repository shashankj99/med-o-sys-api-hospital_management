const router = require('express').Router();

// route middleware
const auth = require('../middleware/auth');

// Requests
const HospitalRequest = require('../requests/hospital.request');
const DepartmentRequest = require('../requests/department.request');
const PaymentHistoryRequest = require('../requests/payment_history.request');

const validation_error = require('../requests/validation_error');

// controllers
const HospitalController = require('../controllers/hospital.controller');
const DepartmentController = require('../controllers/department.controller');
const PaymentHistroyController = require('../controllers/payment_history.controller');

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
router.get('/hospitals', auth('view hospitals'),
    HospitalController.get_all_hospitals
);
router.post('/hospital',
    HospitalRequest.create_hospital_request, validation_error,
    HospitalController.create_hospital
);
router.get('/hospital/:hospital_id', auth('view hospital detail'),
    HospitalController.get_hospital_detail
);
router.put('/hospital/:hospital_id', auth('edit hospital'),
    HospitalRequest.update_hospital_request, validation_error,
    HospitalController.update_hospital_detail
);
router.delete('/hospital/:hospital_id', auth('delete hospital'),
    HospitalController.delete_hospital
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

module.exports = router;
