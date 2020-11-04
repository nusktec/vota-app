/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//votes class
let muser = require('./musers');
let mcandidate = require('./mcandidate');
class MVote extends eng.Model {}
MVote.init({
    vid: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    vuid: {type: eng.DataTypes.INTEGER, allowNull: false},
    vcid: {type: eng.DataTypes.INTEGER, allowNull: false},
}, {sequelize: conn, modelName: 'rs_votes'});
MVote.belongsTo(muser, {as: 'user', foreignKey: 'vuid'});
MVote.belongsTo(mcandidate, {as: 'candidate', foreignKey: 'vcid'});
conn.sync();
module.exports = MVote;