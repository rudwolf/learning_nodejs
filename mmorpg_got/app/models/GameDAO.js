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

GameDAO.prototype.startGame = function (req, res) {
    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("game", function (err, collection) {
            collection.find({
                user: req.session.user,
            }).toArray(function (err, result) {
                var gameData = {};
                gameData.house = req.session.house;
                gameData.attributes = {};
                if (undefined != result[0]) {
                    gameData.attributes = result[0];
                }
                res.render('game', { gameData: gameData });
                mongoclient.close();
            });
        });
    });    
}

module.exports = function () {
    return GameDAO;
}