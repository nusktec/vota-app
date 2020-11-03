/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
let muser = require('./../models/musers');
class Mcandidate extends eng.Model {}
Mcandidate.init({
    cid: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    cuid: {type: eng.DataTypes.INTEGER, allowNull: false},
    ctype: {type: eng.DataTypes.STRING, allowNull: false},
    cposition: {type: eng.DataTypes.STRING, allowNull: false},
    clocation: {type: eng.DataTypes.STRING, allowNull: false},
}, {sequelize: conn, modelName: 'rs_candidates'});
Mcandidate.belongsTo(muser, {as: 'user', foreignKey: 'cuid'});
conn.sync();
module.exports = Mcandidate;