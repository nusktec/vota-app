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
let mdonation = require('./../models/mdonations');

/* get public data. */
router.all('/get', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mpublic.findOne({
            where: {pid: data.pid, pstatus: 1},
            include: [{model: muser, as: 'user', attributes: ['uemail', 'uavatar', 'uphone', 'uid']}]
        }).then((xpublic) => {
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
        }).then((xpublic) => {
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
//////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
router.all('/get-location', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mpublic.findOne({
            where: {plocation: data.plocation, pstatus: 1},
            include: [{model: muser, as: 'user', attributes: ['uemail', 'uavatar', 'uphone', 'uid']}]
        }).then((xpublic) => {
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

router.all('/get-up-coming', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mpublic.findOne({
            where: {pstatus: 1, pdate: {$gte: mysql.literal('NOW()')}},
            include: [{model: muser, as: 'user', attributes: ['uemail', 'uavatar', 'uphone', 'uid']}]
        }).then((xpublic) => {
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
//////////////////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
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
            const [results, metadata] = await mysql.conn.query("select cc.*, uu.*, (select count(*) from rs_networks where nuid='"+data.nuid+"' and ncid=cc.cid)>0 as isNetworked, (select count(*) from rs_votes cv where cv.vcid=cc.cid) as cvotes from rs_candidates cc inner join rs_users uu on cc.cuid=uu.uid");
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
router.get('/election/get-by-location', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        melection.findAll({where: {elocation: data.elocation}, order: [['eid', 'DESC']]})
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
router.get('/election/get-all-future', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        melection.findAll({order: [['eid', 'DESC']], where: {edate: {$gte: mysql.literal('NOW()')}}},)
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
        mnetwork.findAll({
            where: {nuid: data.nuid},
            include: [{
                model: mcandidate,
                as: 'candidate',
                include: [{model: muser, as: 'user', attributes: {exclude: ['upass', 'session']}}]
            }],
            attributes: {include: [[mysql.engine.literal('nuid='+data.nuid), 'isNetworked']]},
        }).then((network) => {
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

/**
 * Donations session
 */
router.all('/donation/add', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        mdonation.create(data)
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

/**
 * Main data for public use
 */
router.get('/main-data', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, async (data) => {
        try {
            const [results, metadata] = await mysql.conn.query("select sum(dn.damount) as total_donations, (select count(*) from rs_candidates) as total_electorate from rs_donations dn");
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

//dashboard
router.get('/charts', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, async (data) => {
        try {
            const [results, metadata] = await mysql.conn.query("select count(*) as total_posts, (select count(*) from rs_publics where ptype=2) as total_events, (select count(*) from rs_users where uverify=1) as total_verified_users, (select count(*) from rs_users where uverify=0) as total_unverified_users, (select count(*) from rs_networks) as total_networks, (select count(*) from rs_comments) as total_comments, (select count(*) from rs_candidates) as total_candidates, (select count(*) from rs_elections) as total_elections, (select count(*) from rs_requests where rstatus=1) as total_approved_requests, (select count(*) from rs_feedbacks) as total_feedbacks, (select count(*) from rs_votes) as total_votes from rs_publics where ptype=1");
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
module.exports = router;