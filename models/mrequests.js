/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
let musers = require('./musers');
class MRequest extends eng.Model {}
MRequest.init({
    rid: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    ruid: {type: eng.DataTypes.INTEGER, allowNull: false},
    rtype: {type: eng.DataTypes.INTEGER, allowNull: false},
    rstatus: {type: eng.DataTypes.INTEGER, allowNull: false, defaultValue: 0},
}, {sequelize: conn, modelName: 'rs_requests'});
MRequest.belongsTo(musers, {as: 'user', foreignKey: 'ruid'});
conn.sync();
module.exports = MRequest;