const router = require('express').Router();

// route middleware
const auth = require('../middleware/auth');

// Requests
const HospitalRequest = require('../requests/hospital.request');
const DepartmentRequest = require('../requests/department.request');

const validation_error = require('../requests/validation_error');

// controllers
const HospitalController = require('../controllers/hospital.controller');
const DepartmentController = require('../controllers/department.controller');

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
router.get('/hospitals', auth,
    HospitalController.get_all_hospitals
);
router.post('/hospital',
    HospitalRequest.create_hospital_request, validation_error,
    HospitalController.create_hospital
);
router.get('/hospital/:hospital_id', auth,
    HospitalController.get_hospital_detail
);
router.put('/hospital/:hospital_id', auth,
    HospitalRequest.update_hospital_request, validation_error,
    HospitalController.update_hospital_detail
);
router.delete('/hospital/:hospital_id', auth,
    HospitalController.delete_hospital
);

/*
 * Department routes
 */
router.get('/departments',
    DepartmentController.get_all_departments
);

router.post('/department', auth,
    DepartmentRequest.create_department, validation_error,
    DepartmentController.create_department
);

router.get('/department/:department_id', auth,
    DepartmentController.get_department_detail
);

router.put('/department/:department_id', auth,
    DepartmentRequest.update_department, validation_error,
    DepartmentController.update_department
);

router.delete('/department/:department_id', auth,
    DepartmentController.delete_department
);

module.exports = router;
