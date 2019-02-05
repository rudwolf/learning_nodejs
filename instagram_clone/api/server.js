var express = require('express'),
    bodyParser = require('body-parser'),
    mongodb = require('mongodb'),
    objectId = require('mongodb').ObjectID;

var app = express();

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

var port = 8080;

app.listen(port);

var db = new mongodb.Db(
    'instagram',
    new mongodb.Server('localhost', 27017, {}),{}
);

console.log('Server Listening on port 8080');

app.get('/', function(req, res){
    var response = {msg:'Hello'};
    res.send(response);
});

app.get('/api', function (req, res) {
    db.open(function (err, mongoclient) {
        mongoclient.collection('posts', function (err, collection) {
            collection.find().toArray(function (err, results) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(results);
                }
                mongoclient.close();
            });
        });
    });
});

app.get('/api/:id', function (req, res) {
    db.open(function (err, mongoclient) {
        mongoclient.collection('posts', function (err, collection) {
            collection.find(objectId(req.params.id)).toArray(function (err, results) {
                if (err) {
                    res.json(err);
                } else {
                    if (results.length > 0)
                        res.json(results);
                    else {
                        res.status(404).json({'error':'post not found'});
                    }
                }
                mongoclient.close();
            });
        });
    });
});

// POST(create)
app.post('/api', function (req, res) {
    var postData = req.body;
    db.open(function (err, mongoclient) {
        mongoclient.collection('posts', function (err, collection) {
            collection.insert(postData, function (err, records) {
                if (err) {
                    res.json({ 'status': 'error' });
                } else {
                    res.json({ 'status': 'post inserted' });
                }
                mongoclient.close();
            });
        });
    });
});

app.put('/api/:id', function (req, res) {
    var postData = req.body;

    db.open(function (err, mongoclient) {
        mongoclient.collection('posts', function (err, collection) {
            collection.update(
                { _id: objectId(req.params.id)},
                {
                    $set : { title: req.body.title }
                },
                {},
                function (err, records) {
                if (err) {
                    res.json(err);
                } else {
                    res.json(records);
                }
                mongoclient.close();
            });
        });
    });
});

app.delete('/api/:id', function (req, res) {
    var postData = req.body;

    db.open(function (err, mongoclient) {
        mongoclient.collection('posts', function (err, collection) {
            collection.remove(
                { _id: objectId(req.params.id) },
                function (err, records) {
                    if (err) {
                        res.json(err);
                    } else {
                        res.json(records);
                    }
                    mongoclient.close();
                });
        });
    });
});
