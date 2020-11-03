/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
class Mconfig extends eng.Model {}

Mconfig.init({
    ctype: {type: eng.DataTypes.STRING, allowNull: false, },
    cdata: {type: eng.DataTypes.STRING, allowNull: false},
}, {sequelize: conn, modelName: 'rs_configs'});

conn.sync();
module.exports = Mconfig;