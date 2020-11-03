/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
class MPublic extends eng.Model {}

MPublic.init({
    pid: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    ptitle: {type: eng.DataTypes.STRING, allowNull: false},
    palias: {type: eng.DataTypes.STRING, allowNull: false},
    pbanner: {type: eng.DataTypes.TEXT, allowNull: false},
    pbody: {type: eng.DataTypes.TEXT, allowNull: false},
    pdate: {type: eng.DataTypes.STRING, allowNull: true},
    ptype: {type: eng.DataTypes.INTEGER, allowNull: false},
}, {sequelize: conn, modelName: 'rs_public'});

conn.sync();
module.exports = MPublic;