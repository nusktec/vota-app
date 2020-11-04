/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
let user = require('./musers');
class MFeedback extends eng.Model {}
MFeedback.init({
    fid: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    fuid: {type: eng.DataTypes.INTEGER, allowNull: false},
    fsubject: {type: eng.DataTypes.STRING, allowNull: false},
    fbody: {type: eng.DataTypes.TEXT, allowNull: false},
}, {sequelize: conn, modelName: 'rs_feedback'});
MFeedback.belongsTo(user, {as: 'user', foreignKey: 'fuid'});
conn.sync();
module.exports = MFeedback;