/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
let user = require('./musers');
let xpublic = require('./mpublic');
class MComments extends eng.Model {}
MComments.init({
    cid: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    cuid: {type: eng.DataTypes.INTEGER, allowNull: false},
    cpid: {type: eng.DataTypes.STRING, allowNull: false},
    cbody: {type: eng.DataTypes.STRING, allowNull: false},
}, {sequelize: conn, modelName: 'rs_comments'});
MComments.belongsTo(user, {as: 'user', foreignKey: 'cuid'});
conn.sync();
module.exports = MComments;