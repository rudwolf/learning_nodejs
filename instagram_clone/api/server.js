var express = require('express'),
    bodyParser = require('body-parser'),
    multiparty = require('connect-multiparty');
    mongodb = require('mongodb'),
    objectId = require('mongodb').ObjectID;
    fs = require('fs');

var app = express();

app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());
app.use(multiparty());

app.use(function(req, res, next){
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

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

app.get('/images/:imgfile', function (req, res) {
    var img = req.params.imgfile;

    fs.readFile('./uploads/'+img, function(err, context) {
        if (err){
            res.status(400).json(err);
            return;
        }

        res.writeHead(200, {'content-type' : 'image/jpg'});
        res.end(context);
    });    
});

// POST(create)
app.post('/api', function (req, res) {
    var date = new Date();
    var img_timestamp = date.getTime();
    var imgFilePath = req.files.image_file.path;

    var imgFileName = img_timestamp + '_' + req.files.image_file.originalFilename;

    var savePath = "./uploads/" + imgFileName;    

    fs.writeFile(savePath, fs.readFileSync(imgFilePath), function(err){
        if (err) {
            res.status(500).json({ error: err });
            return;
        }

        var saveData = {
            image_url: imgFileName,
            title: req.body.title
        };

        db.open(function (err, mongoclient) {
            mongoclient.collection('posts', function (err, collection) {
                collection.insert(saveData, function (err, records) {
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
    
});

app.put('/api/:id', function (req, res) {
    db.open(function (err, mongoclient) {
        mongoclient.collection('posts', function (err, collection) {
            collection.update(
                { _id: objectId(req.params.id)},
                {
                    $push : { comments: {
                        id_comment: new objectId(),
                        comment: req.body.comment
                        }
                    }
                },
                {},
                function (err, records) {
                if (err) {
                    res.status(500).json(err);
                } else {
                    res.json(records);
                }
                mongoclient.close();
            });
        });
    });
});

app.delete('/api/:id', function (req, res) {
    db.open(function (err, mongoclient) {
        mongoclient.collection('posts', function (err, collection) {
            collection.update(
                {  },
                { $pull : {
                        comments: { id_comment : objectId(req.params.id)}
                    }
                },
                {multi: true},
                function (err, records) {
                    if (err) {
                        res.status(500).json(err);
                    } else {
                        res.json(records);
                    }
                    mongoclient.close();
                });
        });
    });
});
