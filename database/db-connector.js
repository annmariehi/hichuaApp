var mysql = require('mysql')

var pool = mysql.createPool({
    connectionLimit: 10,
    host : 'classmysql.engr.oregonstate.edu',
    user    : 'cs340_hicksa2',
    password : '0687',
    database : 'cs340_hicksa2'
})

module.exports.pool = pool;