/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
let muser = require('./../models/musers');
class MDonations extends eng.Model {}

MDonations.init({
    did: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    duid: {type: eng.DataTypes.INTEGER, allowNull: false},
    damount: {type: eng.DataTypes.INTEGER, allowNull: false},
    ddesc: {type: eng.DataTypes.STRING, allowNull: true, defaultValue: 'No Desc'},
}, {sequelize: conn, modelName: 'rs_donations'});
MDonations.belongsTo(muser, {as: 'user', foreignKey: 'duid'});
conn.sync();
module.exports = MDonations;