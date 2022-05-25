const mysql = require("mysql2/promise");
require('dotenv').config();

const config = {
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PW,
    port     : process.env.DB_PORT,
    database : process.env.DB_NAME,
    connectionLimit : 20
};

const pool = mysql.createPool(config);
console.log('Connection pool created.');

pool.on('acquire', function (connection) {
    console.log(`Connection ${connection.threadId} acquired`);
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

pool.on('release', function (connection) {
    console.log(`Connection ${connection.threadId} released`);
});

module.exports = pool;