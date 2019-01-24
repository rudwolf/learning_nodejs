var http = require('http');

var options = {
    hostname: 'scotch.local',
    post: 80,
    path: '/',
    method: "post",
    headers: {
        'Accept' : 'application/json',
        'Content-type' : 'application/json'
    }
};

//var html = 'name=Homer';
var json = {name: 'Homer'};
var string_json = JSON.stringify(json);

var buffer_body_response = [];

var req = http.request(options, function(res) {
    res.on('data', function (chunk) {
        buffer_body_response.push(chunk);
    });
    res.on('end', function () {
        var body_response = Buffer.concat(buffer_body_response).toString();
        console.log(body_response);
        console.log(res.statusCode);
    });    
});

req.write(string_json);

req.end();