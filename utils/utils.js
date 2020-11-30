/**
 * Created by revelation on 18/05/2020.
 */
let tmpUtils = require('./tmpUtils');
//json writer
function Jwr(res, status, data) {
    res.status((status.code ? (status.code === true ? 200 : status.code) : 428)).jsonp({
        boot: status.error,
        action: status.action,
        data: data,
        resp: 'See documentation for reference purpose'
    });
}

//check if body is empty
function checkBody(res, body, cbk, isTrue) {
    if (isTrue) {
        cbk(body);
        return;
    }
    if (typeof body !== 'undefined' && body !== null && Object.keys(body).length > 0) {
        cbk(body);
    } else {
        Jwr(res, {code: 428, error: 1002, action: false}, []);
    }
}

//get eve mode
function getEnvStatus(req) {
    return req.app.get('env') === 'development';
}
//export modules
module.exports = {Jwr: Jwr, JSONChecker: checkBody, util: tmpUtils, getEnvStatus};