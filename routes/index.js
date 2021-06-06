const router = require('express').Router();
const auth = require('../middleware/auth');

router.get('/', function (req, res) {
    return res.status(200)
        .json({
            status: 200,
            success: true
        });
})

module.exports = router;
