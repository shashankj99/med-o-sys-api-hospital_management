const router = require('express').Router();
const auth = require('../middleware/auth');
const HospitalController = require('../controllers/hospital.controller');
const HospitalRequest = require('../requests/hospital.request');
const validation_error = require('../requests/validation_error');

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

module.exports = router;
