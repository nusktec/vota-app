/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
class MNotifications extends eng.Model {}

MNotifications.init({
    nid: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    nuid: {type: eng.DataTypes.INTEGER, allowNull: false},
    nsender: {type: eng.DataTypes.STRING, allowNull: false},
    nbody: {type: eng.DataTypes.STRING, allowNull: false},
}, {sequelize: conn, modelName: 'rs_notifications'});

conn.sync();
module.exports = MNotifications;