/**
 * Created by revelation on 18/05/2020.
 */
const MYSQL_CONN = {
    dbName: 'rs_vota',
    dbUser: 'root',
    dbPass: 'mysql',
    host: 'localhost',
    port: 3306,
    pool: {max: 5, min: 0, acquire: 30000, idle: 10000}
};
//For online purpose
// const MYSQL_CONN = {
//     dbName: 'kidsxytx_kidsreadx',
//     dbUser: 'kidsxytx_kidx',
//     dbPass: 'xvqHD7BZ9hQ9',
//     host: 'localhost',
//     port: 3306,
//     pool: {max: 5, min: 0, acquire: 30000, idle: 10000}
// };
//SSK
const LC_SSK = "a8ae58f0470acbfbe357d2c8b35a7ac4d17733c7";
//JWT
const JSW_HASH = {exp: '2w', secrete: 'reedax.io'};

module.exports = {MYSQL_CONN: MYSQL_CONN, SSK: LC_SSK, JSW: JSW_HASH};