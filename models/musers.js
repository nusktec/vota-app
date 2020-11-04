/**
 * Created by revelation on 18/05/2020.
 */
const dbConn = require('./mysql');
let eng = dbConn.engine;
let conn = dbConn.conn;
//user class
class Users extends eng.Model {
}
Users.init({
    uid: {primaryKey: true, autoIncrement: true, type: eng.DataTypes.INTEGER},
    uname: {type: eng.DataTypes.STRING, allowNull: false},
    uemail: {type: eng.DataTypes.STRING, unique: true, allowNull: false},
    upass: {type: eng.DataTypes.STRING, allowNull: false},
    uphone: {type: eng.DataTypes.STRING, allowNull: true},
    uaddress: {type: eng.DataTypes.STRING, allowNull: true},
    ucountry: {type: eng.DataTypes.STRING, allowNull: true},
    ustate: {type: eng.DataTypes.STRING, allowNull: true},
    ugender: {type: eng.DataTypes.STRING(5), allowNull: true},
    uavatar: {type: eng.DataTypes.STRING, allowNull: true, defaultValue: 'https://firebasestorage.googleapis.com/v0/b/ema-front.appspot.com/o/avatars%2Fimage-placeholder.jpg?alt=media'},
    ubio: {type: eng.DataTypes.STRING, allowNull: true},
    utype: {type: eng.DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    ucandidate: {type: eng.DataTypes.INTEGER, allowNull: false, defaultValue: 0},
    upvc: {type: eng.DataTypes.STRING(255), allowNull: true},
    uparty: {type: eng.DataTypes.STRING(255), allowNull: true},
    uissues: {type: eng.DataTypes.TEXT, allowNull: true},
    usolutions: {type: eng.DataTypes.TEXT, allowNull: true},
    usession: {type: eng.DataTypes.STRING(255), allowNull: true},
    uverify: {type: eng.DataTypes.INTEGER, allowNull: false, defaultValue: 0},
}, {sequelize: conn, modelName: 'rs_users'});
conn.sync();
module.exports = Users;