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

module.exports = router;
