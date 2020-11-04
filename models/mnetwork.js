/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
let mcandidate = require('./../models/mcandidate');
class MNetwork extends eng.Model {}

MNetwork.init({
    nid: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    nuid: {type: eng.DataTypes.INTEGER, allowNull: false},
    ncid: {type: eng.DataTypes.INTEGER, allowNull: false},
}, {sequelize: conn, modelName: 'rs_network'});
MNetwork.belongsTo(mcandidate, {as: 'candidate', foreignKey: 'ncid'});
conn.sync();
module.exports = MNetwork;