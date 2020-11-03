/**
 * Created by revelation on 19/05/2020.
 */
let muser = require('./musers');
let mnotification = require('./mnotifications');
require('./mconfigs');
const create = false;
class init {
    constructor() {
        if (create) {
            //declare any new
            muser;
            mnotification;
        }
    }
}

module.exports = init;