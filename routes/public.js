let express = require('express');
let router = express.Router();
let sha1 = require('sha1');
let md5 = require('md5');
let auth = require('./../auth/auth');
//custom libs
let util = require('../utils/utils');
//models
let mysql = require('./../models/mysql');
let mpublic = require('./../models/mpublic');
let mcomment = require('./../models/mcomments');
let muser = require('./../models/musers');
let mcandidate = require('./../models/mcandidate');
let mvote = require('./../models/mvotes');
let melection = require('./../models/melections');
let mfeedback = require('./../models/mfeedback');
let mnetwork = require('./../models/mnetwork');

/* get public data. */
router.all('/get', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mpublic.findOne({
            where: {pid: data.pid, pstatus: 1},
            include: [{model: muser, as: 'user', attributes: ['uemail', 'uavatar', 'uphone', 'uid']}]
        })
            .then((xpublic) => {
                if (xpublic !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, xpublic);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true);
});

router.all('/get-alias', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mpublic.findOne({
            where: {palias: data.palias, pstatus: 1},
            include: [{model: muser, as: 'user', attributes: ['uemail', 'uavatar', 'uphone', 'uid']}]
        })
            .then((xpublic) => {
                if (xpublic !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, xpublic);
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
        mpublic.findAll({
            where: {pstatus: 1},
            order: [['pid', 'DESC']],
            include: [{model: muser, as: 'user', attributes: ['uemail', 'uavatar', 'uphone', 'uid']}]
        })
            .then((xpublic) => {
                if (xpublic !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, xpublic);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
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


/**
 * Comment Session
 */
router.all('/comments/get-all', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mcomment.findAll({
            where: {cpid: data.pid},
            include: [{model: muser, as: 'user', attributes: {exclude: ['upass']}}]
        })
            .then((comment) => {
                if (comment !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, comment);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false);
});

router.all('/comments/add', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mcomment.create(data)
            .then((comment) => {
                if (comment !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, comment);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false);
});

/**
 * Candidates Session
 */
router.get('/vote/get-candidates', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, async (data) => {
        try {
            const [results, metadata] = await mysql.conn.query("select cc.*, uu.*, (select count(*) from rs_votes cv where cv.vcid=cc.cid) as cvotes from rs_candidates cc inner join rs_users uu on cc.cuid=uu.uid");
            if (results !== null) {
                util.Jwr(res, {code: 200, error: 2000, action: true}, results);
                return;
            }
            util.Jwr(res, {code: 417, error: 1006, action: false}, []);
        } catch (ex) {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        }
    }, true);
});

router.all('/vote/get-candidate-id', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, async (data) => {
        try {
            const [results, metadata] = await mysql.conn.query("select cc.*, uu.*, (select count(*) from rs_votes cv where cv.vcid=cc.cid) as cvotes from rs_candidates cc inner join rs_users uu on cc.cuid=uu.uid where cc.cid=" + data.cid);
            if (results !== null) {
                util.Jwr(res, {code: 200, error: 2000, action: true}, results);
                return;
            }
            util.Jwr(res, {code: 417, error: 1006, action: false}, []);
        } catch (ex) {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        }
    }, true);
});

router.all('/vote/get-candidate-type', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, async (data) => {
        try {
            const [results, metadata] = await mysql.conn.query("select cc.*, uu.*, (select count(*) from rs_votes cv where cv.vcid=cc.cid) as cvotes from rs_candidates cc inner join rs_users uu on cc.cuid=uu.uid where cc.ctype='" + data.ctype + "'");
            if (results !== null) {
                util.Jwr(res, {code: 200, error: 2000, action: true}, results);
                return;
            }
            util.Jwr(res, {code: 417, error: 1006, action: false}, []);
        } catch (ex) {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        }
    }, true);
});

router.all('/vote/get-candidate-location', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, async (data) => {
        try {
            const [results, metadata] = await mysql.conn.query("select cc.*, uu.*, (select count(*) from rs_votes cv where cv.vcid=cc.cid) as cvotes from rs_candidates cc inner join rs_users uu on cc.cuid=uu.uid where cc.clocation='" + data.clocation + "'");
            if (results !== null) {
                util.Jwr(res, {code: 200, error: 2000, action: true}, results);
                return;
            }
            util.Jwr(res, {code: 417, error: 1006, action: false}, []);
        } catch (ex) {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        }
    }, true);
});

router.all('/vote/add', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mvote.findOrCreate({where: {vuid: data.vuid, vcid: data.vcid}, defaults: data})
            .then(([vote, created]) => {
                if (created !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, vote);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false);
});

/**
 * Election Session
 */
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

/**
 * Submission Session
 */
router.all('/submission/add', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mpublic.create(data)
            .then((submission) => {
                if (submission !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, submission);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true);
});
router.all('/submission/get-user-submission', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mpublic.findAll({
            where: {powner: data.powner},
            include: [{model: muser, as: 'user', attributes: ['uemail', 'uavatar', 'uphone', 'uid']}]
        })
            .then((xpublic) => {
                if (xpublic !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, xpublic);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true);
});

/*
 Feedback session
 */
router.all('/feedback/add', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mfeedback.create(data)
            .then((feedback) => {
                if (feedback !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, feedback);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true);
});
/**
 * Networking
 */
router.all('/network/add', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mnetwork.findOrCreate({where: {nuid: data.nuid, ncid: data.ncid}, defaults: data})
            .then((network) => {
                if (network !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, network);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true);
});

router.all('/network/del', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mnetwork.destroy({where: {nuid: data.nuid, ncid: data.ncid}})
            .then((network) => {
                if (network !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, network);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true);
});

router.all('/network/get-user-all', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mnetwork.findAll({where: {nuid: data.nuid}, include: [{model: mcandidate, as: 'candidate', include: [{model: muser, as: 'user', attributes: {exclude: ['upass']}}]}]})
            .then((network) => {
                if (network !== null) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, network);
                } else {
                    util.Jwr(res, {code: 417, error: 1006, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false);
});
module.exports = router;