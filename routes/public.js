let express = require('express');
let router = express.Router();
let sha1 = require('sha1');
let md5 = require('md5');
let auth = require('./../auth/auth');
//custom libs
let util = require('../utils/utils');
//models
let mpublic = require('./../models/mpublic');
/* login user. */
router.get('/get', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mpublic.findOne({where: {pid: data.pid}})
            .then((user) => {
                if (user !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, user);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true);
});

router.get('/get-all', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mpublic.findAll({order: [['pid', 'DESC']]})
            .then((xpublic) => {
                if (xpublic!== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, xpublic);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
                console.log(err);
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true);
});

/* create user. */
router.all('/create', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mpublic.findOrCreate({where: {palias: data.palias}, defaults: data})
            .then(([xpublic, created]) => {
                if (created) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, xpublic);
                } else {
                    util.Jwr(res, {code: 417, error: 1007, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

/* user update. */
router.all('/update', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mpublic.findOne({where: {pid: data.pid}})
            .then((user) => {
                if (user) {
                    //apply new updates
                    user.update(data);
                    util.Jwr(res, {code: 200, error: 2000, action: true}, user);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

module.exports = router;