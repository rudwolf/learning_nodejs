var ObjectID = require('mongodb').ObjectId;

function GameDAO(connection) {
    this._connection = connection();
}

GameDAO.prototype.generateAttributes = function(user) {
    this._connection.open( function(err, mongoclient) {
        mongoclient.collection("game", function(err, collection){
            collection.insert({
                user: user,
                money: 15,
                subjects: 10,
                scrolls: 0,
                fear: Math.floor(Math.random() * 1000),
                wisdom: Math.floor(Math.random() * 1000),
                commerce: Math.floor(Math.random() * 1000),
                magic: Math.floor(Math.random() * 1000),
            });
            mongoclient.close();
        });        
    });
};

GameDAO.prototype.startGame = function (req, res, msg) {
    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("game", function (err, collection) {
            collection.find({
                user: req.session.user,
            }).toArray(function (err, result) {
                var gameData = {};
                gameData.house = req.session.house;
                gameData.msg = msg;
                gameData.attributes = {};
                if (undefined != result[0]) {
                    gameData.attributes = result[0];
                }
                res.render('game', { gameData: gameData });
                console.log(req.session.user);
                mongoclient.close();
            });
        });
    });    
};

GameDAO.prototype.subjectAction = function (formData) {

    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("action", function (err, collection) {
            var date = new Date();

            var timeToComplete = null;

            switch (parseInt(formData.action)) {
                case 1: timeToComplete = 1 * 60 * 60000; break;
                case 2: timeToComplete = 2 * 60 * 60000; break;
                case 3: timeToComplete = 3 * 60 * 60000; break;
                case 5: timeToComplete = 5 * 60 * 60000; break;
            }

            formData.action_finishes_in = date.getTime() + timeToComplete;

            collection.insert(formData);
        });

        mongoclient.collection("game", function (err, collection) {

            var coins = null;
            var amount = formData.amount;

            switch (parseInt(formData.action)) {
                case 1: coins = -2 * amount; break;
                case 2: coins = -3 * amount; break;
                case 3: coins = -1 * amount; break;
                case 5: coins = -1 * amount; break;
            }

            collection.update(
                { user: formData.user},
                { $inc: {money: coins}}
            );

            mongoclient.close();
        });
    });
};

GameDAO.prototype.getActions = function(user, res) {
    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("action", function (err, collection) {

            var date = new Date();
            var current_moment = date.getTime();

            collection.find({
                user: user,
                action_finishes_in: {$gt:current_moment}
            }).toArray(function (err, result) {
                
                res.render("scrolls", {actions: result});

                mongoclient.close();
            });
        });

    });
};

GameDAO.prototype.revokeAction = function (_id, res) {

    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("action", function (err, collection) {

            collection.remove(
                { _id: ObjectID(_id)},
                function(err, result) {
                    res.redirect('game?msg=RV');
                }
            );

            mongoclient.close();
        });
    });
};

module.exports = function () {
    return GameDAO;
};