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
                fear: Math.floor(Math.random() * 1000),
                wisdom: Math.floor(Math.random() * 1000),
                commerce: Math.floor(Math.random() * 1000),
                magic: Math.floor(Math.random() * 1000),
            });
            mongoclient.close();
        });        
    });
}

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
                console.log(gameData);
                mongoclient.close();
            });
        });
    });    
}

GameDAO.prototype.subjectAction = function (formData) {
    console.log(formData);
    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("action", function (err, collection) {
            var date = new Date();

            var timeToComplete = null;

            switch (formData.action) {
                case 1: timeToComplete = 1 * 60 * 60000;
                case 2: timeToComplete = 2 * 60 * 60000;
                case 3: timeToComplete = 3 * 60 * 60000;
                case 5: timeToComplete = 5 * 60 * 60000;
            }

            formData.action_finishes_in = date.getTime() + timeToComplete;

            collection.insert(formData);
        });
    });
}

GameDAO.prototype.getActions = function(user) {
    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("action", function (err, collection) {
            collection.find({
                user: user,
            }).toArray(function (err, result) {
                console.log(result);
                mongoclient.close();
            });
        });
    });
}

module.exports = function () {
    return GameDAO;
}