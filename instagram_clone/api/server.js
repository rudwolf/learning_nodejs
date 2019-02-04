var express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb');

var app = express();

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

console.log('Server Listening on port 8080');

app.get('/', function(req, res){
    var response = {msg:'Hello'};
    res.send(response);
})