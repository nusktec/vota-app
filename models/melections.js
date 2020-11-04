/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
class MElection extends eng.Model {}
MElection.init({
    eid: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    etype: {type: eng.DataTypes.STRING, allowNull: false},
    elocation: {type: eng.DataTypes.STRING, allowNull: false},
    ebanner: {type: eng.DataTypes.TEXT, allowNull: false},
    edate: {type: eng.DataTypes.STRING, allowNull: false},
}, {sequelize: conn, modelName: 'rs_elections'});
conn.sync();
module.exports = MElection;