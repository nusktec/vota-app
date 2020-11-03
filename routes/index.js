let express = require('express');
let router = express.Router();
let util = require('../utils/utils');
/* GET home page. */
router.all('/', function (req, res, next) {
    util.Jwr(res, {code: 200, error: 2000, action: false}, ['Welcome to Reedax.IO Api Engine']);
});

router.all('/api', function (req, res, next) {
    util.Jwr(res, {code: 200, error: 2000, action: false}, ['Welcome to Reedax.IO Api Engine']);
});

module.exports = router;
