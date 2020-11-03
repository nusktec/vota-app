/**
 * Created by revelation on 18/05/2020.
 */
//DECLARE DATA BASE
const Sequelize = require('sequelize');
const MYSQL_CONN = require('./../utils/constants').MYSQL_CONN;

const sequelize = new Sequelize(MYSQL_CONN.dbName, MYSQL_CONN.dbUser, MYSQL_CONN.dbPass, {
    host: MYSQL_CONN.host,
    port: MYSQL_CONN.port,
    pool: MYSQL_CONN.pool,
    dialect: 'mysql',
    define: {timestamp: true},
    logging: function (log) {
        //console.log(log);
    },
});

module.exports = {conn: sequelize, engine: Sequelize};