/* import mongodb */
var mongo = require('mongodb');

var connMongoDB = function () {
    console.log('MongoDB Connection Activated');
    var db = new mongo.Db(
        'got',
        new mongo.Server(
            'localhost', // server 
            27017, // port
            {}
        ),
        {}
    );
    return db;
};

module.exports = function() {
    return connMongoDB;
};