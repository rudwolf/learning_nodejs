var mysql = require('mysql');

var current_conn = function() {
    console.log('DB Connected...');
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'curso_node'
    });
};

module.exports = function () {
    return current_conn;
};
