let express = require('express');
let router = express.Router();
let sha1 = require('sha1');
let md5 = require('md5');
let auth = require('./../auth/auth');
//custom libs
let util = require('../utils/utils');
//models
let mconfig = require('./../models/mconfigs');
/* login user. */
router.get('/get', function (req, res, next) {
    mconfig.findAll()
        .then((config) => {
            if (config !== null) {
                util.Jwr(res, {code: 200, error: 2000, action: true}, config);
            } else {
                util.Jwr(res, {code: 417, error: 1006, action: false}, []);
            }
        }).catch(err => {
        util.Jwr(res, {code: 428, error: 1005, action: false}, []);
    })
});

/* create user. */
router.all('/add', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        //check if password is lift
        mconfig.findOrCreate({where: {ctype: data.ctype}, defaults: data})
            .then(([config, created]) => {
                if (created) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, config);
                } else {
                    util.Jwr(res, {code: 417, error: 1007, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

router.all('/update', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mconfig.findOne({where: {ctype: data.ctype}})
            .then((config) => {
                if (config) {
                    config.cdata = data.cdata;
                    config.update(config);
                    util.Jwr(res, {code: 200, error: 2000, action: true}, config);
                } else {
                    util.Jwr(res, {code: 417, error: 1007, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

module.exports = router;