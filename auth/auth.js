/**
 * Created by revelation on 18/05/2020.
 */
let md5 = require('md5');
let token = require('jsonwebtoken');
let con = require('./../utils/constants');
let util = require('./../utils/utils');

class TokenAuth {
    //sign token
    static Jsign(data) {
        return token.sign(data, con.JSW.secrete, {expiresIn: '14d'});
    }

    //verify token
    static Jverify(req, res, next) {
        let body = req.body;
        if (body !== null && Object.keys(body).length > 0) {
            token.verify(body.utoken, con.JSW.secrete, (err, data) => {
                if (!err) {
                    //move to the next route
                    res.locals.juser = data;
                    next()
                } else {
                    util.Jwr(res, false, [], "Token expired !")
                }
            })
        } else {
            util.Jwr(res, false, {}, "Invalid token supplied !");
        }
    }

    //get token data

    //headers
    static allowHeaders(req, res, next) {

        // Website you wish to allow to connect
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, ssk");
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        // Pass to next layer of middleware
        next();
    }

    //check friendly token
    static friendToken(req, res, next) {
        //reject if friendly token doesn't exist
        try {
            let uToken = JSON.parse(JSON.stringify(req.headers)).ssk;
            if (uToken !== null && uToken === con.SSK) {
                res.statusCode = 200;
                next()
            } else {
                res.statusCode = 401;
                util.Jwr(res, {code: 401, error: 1001, action: false}, []);
            }
        } catch (err) {
            res.statusCode = 401;
            util.Jwr(res, {code: 401, error: 1001, action: false}, []);
        }
    }
}

module.exports = TokenAuth;