let express = require('express');
let router = express.Router();
let sha1 = require('sha1');
let md5 = require('md5');
let auth = require('./../auth/auth');
//custom libs
let util = require('../utils/utils');
//models
let muser = require('./../models/musers');
let mfeedback = require('./../models/mfeedback');
let mrequest = require('./../models/mrequests');
let melection = require('./../models/melections');
let mdoanation = require('./../models/mdonations');
/* login user. */
router.all('/login', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        muser.findOne({where: {uemail: data.uemail, upass: sha1(data.upass), utype: '1'}})
            .then((user) => {
                if (user !== null) {
                    user.update({usession: md5(user.uid)});
                    //generate token
                    user = user.get({plain: true});
                    user.utoken = auth.Jsign(user, sha1(user.uid));
                    util.Jwr(res, {code: 200, error: 2000, action: true}, user);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false);
});

/* password reset. */
router.all('/reset', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        muser.findOne({where: {uemail: data.uemail, utype: 1}})
            .then((user) => {
                if (user !== null) {
                    //password reset, send
                    let _tmpPass = util.util.getRandomChar(10);
                    user.update({upass: sha1(_tmpPass)});
                    //send email containing the password

                    //blank display if dev
                    if (!util.getEnvStatus(req)) {
                        _tmpPass = ''
                    }
                    util.Jwr(res, {code: 200, error: 2000, action: true}, _tmpPass);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false);
});

/* user update. */
router.all('/update', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        muser.findOne({where: {uid: data.uid, utype: 0}})
            .then((user) => {
                if (user) {
                    //set if password exist
                    if (data.upass !== null && data.upass) {
                        data.upass = sha1(data.upass);
                    }
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

/* create user. */
router.all('/action/create', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        //check if password is lift
        if (data.upass.toString().length < 5) {
            util.Jwr(res, {code: 416, error: 1008, action: false}, []);
            return;
        }
        //assign sha1 password
        data.upass = sha1(data.upass);
        muser.findOrCreate({where: {uemail: data.uemail}, defaults: data})
            .then(([user, created]) => {
                if (created) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, user);
                } else {
                    util.Jwr(res, {code: 417, error: 1007, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

router.all('/action/update', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        muser.findOne({where: {uid: data.uid, utype: 0}})
            .then((user) => {
                if (user) {
                    //set if password exist
                    if (data.upass !== null && data.upass) {
                        data.upass = sha1(data.upass);
                    }
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

router.get('/action/list', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        muser.findAll({where: {utype: 0}, exclude: ['upass']})
            .then((user) => {
                if (user) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, user);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true)
});

router.get('/action/requests/list', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mrequest.findAll({include: [{model: muser, as: 'user'}]}).then((request) => {
            if (request) {
                util.Jwr(res, {code: 200, error: 2000, action: true}, request);
            } else {
                util.Jwr(res, {code: 417, error: 1006, action: false}, []);
            }
        }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true)
});

router.all('/action/requests/cmd', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mrequest.findOne({where: {ruid: data.ruid}})
            .then((request) => {
                if (request) {
                    request.rstatus = data.rstatus;
                    request.update(request);
                    util.Jwr(res, {code: 200, error: 2000, action: true}, request);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

/* create candidate type. */
router.all('/action/candidate/create', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        //check if password is lift
        if (data.upass.toString().length < 5) {
            util.Jwr(res, {code: 416, error: 1008, action: false}, []);
            return;
        }
        //assign sha1 password
        data.upass = sha1(data.upass);
        muser.findOrCreate({where: {uemail: data.uemail}, defaults: data})
            .then(([user, created]) => {
                if (created) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, user);
                } else {
                    util.Jwr(res, {code: 417, error: 1007, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

/**
 * Election Session
 */
router.all('/election/add', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        melection.create(data)
            .then((created) => {
                if (created !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, created);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false);
});

router.all('/election/del', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        melection.destroy({where: {eid: data.eid}})
            .then((resp) => {
                util.Jwr(res, {code: 200, error: 2000, action: true}, resp);
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false);
});

router.get('/election/get-all', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        melection.findAll({order: [['eid', 'DESC']]})
            .then((election) => {
                if (election !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, election);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true);
});

/*
 FeedBack Session
 */
router.get('/feedback/all', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mfeedback.findAll({include: {model: muser, as: 'user'}})
            .then((feedback) => {
                if (feedback) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, feedback);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true)
});

/*
 Donations Session
 */
router.get('/donation/all', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mdoanation.findAll({include: [{model: muser, as: 'user', attributes: ['uid', 'uemail', 'uname', 'uavatar']}]})
            .then((donation) => {
                if (donation) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, donation);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true)
});
module.exports = router;