let express = require('express');
let request = require('request');
let router = express.Router();
let sha1 = require('sha1');
let md5 = require('md5');
let auth = require('./../auth/auth');
//custom libs
let util = require('../utils/utils');
let mysql = require('./../models/mysql');
//models
let muser = require('./../models/musers');
let mrequest = require('./../models/mrequests');
let mcandidate = require('./../models/mcandidate');

const {Op} = require('sequelize');
/* login user. */
router.all('/login', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        muser.findOne({where: {uemail: data.uemail, upass: sha1(data.upass), utype: 0}})
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

/* create user. */
router.all('/create', function (req, res, next) {
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

router.all('/create-social', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        //check if password is lift
        data.upass = "123456";
        //assign sha1 password
        data.upass = sha1(data.upass);
        data.uname = "Vota Member";
        muser.findOrCreate({where: {uemail: data.uemail}, defaults: data})
            .then(([user, created]) => {
                if (created) {
                    user.update({usession: md5(user.uid)});
                    //generate token
                    user = user.get({plain: true});
                    user.utoken = auth.Jsign(user, sha1(user.uid));
                    util.Jwr(res, {code: 200, error: 2000, action: true}, user);
                } else {
                    user = user.get({plain: true});
                    user.utoken = auth.Jsign(user, sha1(user.uid));
                    util.Jwr(res, {code: 200, error: 2000, action: true}, user);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

/* password reset. */
router.all('/reset', function (req, res, next) {
    //check if body is empty
    util.JSONChecker(res, req.body, (data) => {
        muser.findOne({where: {uemail: data.uemail}})
            .then((user) => {
                if (user !== null) {
                    //password reset, send
                    let _tmpPass = util.util.getRandomChar(10);
                    user.update({upass: sha1(_tmpPass)});
                    //send email containing the password
                    request.get('http://vota-ng.org/email/sender.php?to=' + user.uemail + '&body=Hi, ' + user.uname + '<br>You requested for password rest with the auto generated password below:<br><h3>' + _tmpPass + '</h3>' + '&title=Password Reset Request', function (err, res, body) {

                    });
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
        muser.findOne({where: {uid: data.uid}})
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

/* user search. */
router.all('/search', function (req, res, next) {
    util.JSONChecker(res, req.body, async (data) => {
        //raw sql in search
      try{
          const [results, metadata] = await mysql.conn.query("select uu.*, cc.*, (select count(*) from rs_networks where nuid=uu.uid and ncid=cc.cid)>0 as isNetworked from rs_users uu inner join rs_candidates cc on uu.uid=cc.cuid WHERE uu.uname LIKE '"+data.name+"%'");
          if(results){
              util.Jwr(res, {code: 200, error: 2000, action: true}, results);
          }else{
              util.Jwr(res, {code: 200, error: 2000, action: false}, []);
          }
      }catch (ex){
          util.Jwr(res, {code: 200, error: 2000, action: false}, []);
      }
        // muser.findAll({where: {uname: {[Op.substring]: data.name}}, order: [['uname', 'ASC']]}).then((user) => {
        //     if (user) {
        //         util.Jwr(res, {code: 200, error: 2000, action: true}, user);
        //     } else {
        //         util.Jwr(res, {code: 417, error: 1006, action: false}, []);
        //     }
        // }).catch(err => {
        //     console.log(err);
        //     util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        // })
    }, false)
});

/* create request entries */
router.all('/action/request', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mrequest.findOrCreate({where: {ruid: data.ruid}, defaults: data})
            .then(([request, created]) => {
                if (created) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, request);
                } else {
                    util.Jwr(res, {code: 417, error: 1007, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

/*create a candidate request*/
router.all('/action/candidate/request', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mcandidate.findOrCreate({where: {cuid: data.cuid}, defaults: data})
            .then(([request, created]) => {
                if (created) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, request);
                } else {
                    util.Jwr(res, {code: 417, error: 1007, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

router.all('/action/candidate/get', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mcandidate.findOne({where: {cuid: data.cuid}, include: [{model: muser, as: 'user'}]})
            .then((request) => {
                if (request) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, request);
                } else {
                    util.Jwr(res, {code: 417, error: 1007, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, false)
});

router.get('/action/candidate/get-all', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        mcandidate.findAll({include: [{model: muser, as: 'user'}], order: [['cid', 'DESC']]})
            .then((request) => {
                if (request) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, request);
                } else {
                    util.Jwr(res, {code: 417, error: 1007, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true)
});

router.all('/action/get-user-id', function (req, res, next) {
    util.JSONChecker(res, req.body, (data) => {
        muser.findOne({where: {uid: data.uid}})
            .then((request) => {
                if (request) {
                    util.Jwr(res, {code: 200, error: 2000, action: true}, request);
                } else {
                    util.Jwr(res, {code: 417, error: 1007, action: false}, []);
                }
            }).catch(err => {
            util.Jwr(res, {code: 428, error: 1005, action: false}, []);
        })
    }, true)
});

module.exports = router;