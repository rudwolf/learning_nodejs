var ObjectID = require('mongodb').ObjectId;

var ActionList = {
    1: {
        'name': 'Collect Resources',
        'label': 'Collect Resources (2G &amp; 1H)',
        'cost': 2,
        'time': 1,
        'rewards' : {
            'money': 5,
            'subjects': 2,
            'commerce': 10,
            'reputation': 5
        }
    },
    2: {
        'name': 'Hang subject',
        'label': 'Hang subject (3G &amp; 2H)',
        'cost': 3,
        'time': 2,
        'rewards': {
            'subjects': -1,
            'fear': 20,
            'reputation': -1
        }
    },
    3: {
        'name': 'Teach History',
        'label': 'Teach History (1G &amp; 5H)',
        'cost': 1,
        'time': 5,
        'rewards': {
            'wisdom': 50,
            'reputation': 5
        }
    },
    4: {
        'name': 'Teach Magic',
        'label': 'Teach Magic (1G &amp; 5H)',
        'cost': 1,
        'time': 5,
        'rewards': {
            'magic': 50,
            'reputation': 5
        }
    }
};

var MessageList = {
    'CX': {
        'type': 'success',
        'msg': 'Your wish is my command Master! Order accepted and sent to our troops!'
    },
    'CD': {
        'type': 'success',
        'msg' : 'Dear master, one of your actions has finished! Enjoy!'
    },
    'RV': {
        'type': 'success',
        'msg': 'My Master, this action has been cancelled by your order!'
    },
    'CL': {
        'type': 'success',
        'msg' : 'Your effort, your prize Master! Reward claimed, check your stats!'
    },
    'SU': {
        'type': 'success',
        'msg': 'Status updated, check your stats!'
    },
    'CE': {
        'type': 'danger',
        'msg': 'Invalid Command! Please select an action and the amount!'
    },
    'LE': {
        'type': 'danger',
        'msg': 'Sorry Master! This Reward was already claimed, check your stats!'
    },
    'NM': {
        'type': 'danger',
        'msg': 'Sorry Master! We don\'t have enough money to act on this right now, maybe another day?'
    }
};

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
                working_subjects: 0,
                scrolls: 0,
                reputation: 0,
                fear: Math.floor(Math.random() * 500),
                wisdom: Math.floor(Math.random() * 500),
                commerce: Math.floor(Math.random() * 500),
                magic: Math.floor(Math.random() * 500),
            });
            mongoclient.close();
        });
    });
};

GameDAO.prototype.startGame = function (req, res, msg) {
    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("game", function (err, collection) {

            if (msg == 'CD') {
                collection.update(
                    { user: req.session.user },
                    { $inc: { scrolls: -1 } }
                );                
            }

            collection.find({
                user: req.session.user,
            }).toArray(function (err, result) {
                var gameData = {};
                gameData.house = req.session.house;
                gameData.msg = msg;
                gameData.msg_list = MessageList;
                gameData.attributes = {};
                if (undefined != result[0]) {
                    gameData.attributes = result[0];
                }
                res.render('game', { gameData: gameData });
                //console.log(gameData);
                mongoclient.close();
            });
        });
    });    
};

GameDAO.prototype.subjectAction = function (formData, req, res) {

    this._connection.open(function (err, mongoclient) {
        var coins = null;
        var amount = formData.amount;

        switch (parseInt(formData.action)) {
            case 1: coins = -2 * amount; break;
            case 2: coins = -3 * amount; break;
            case 3: coins = -1 * amount; break;
            case 5: coins = -1 * amount; break;
        }

        mongoclient.collection("game", function (err, collection) {

            collection.find({
                user: formData.user
            }).toArray(function (err, result) {
                if (undefined != result[0]) {
                    currentGame = result[0];
                    // calculate first if user has enough money to do the action
                    future_balance = parseInt(currentGame.money) + coins;
                    //console.log(future_balance);
                    //res.redirect('game?msg=NM');

                    if (parseInt(future_balance) < 0) {
                        res.redirect('game?msg=NM');
                    } else {
                        collection.update(
                            { user: formData.user },
                            { $inc: { money: coins, scrolls: 1 } }
                        );

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

                            res.redirect('game?msg=CX');
                        });
                        
                    }

                    mongoclient.close();
                }
            });

            
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

GameDAO.prototype.getCompleted = function (userData, res) {
    this._connection.open(function (err, mongoclient) {
        var gameData = {};

        mongoclient.collection("game", function (err, collection) {
            collection.find({
                user: userData,
            }).toArray(function (err, result) {
                    gameData.attributes = {};
                if (undefined != result[0]) {
                    gameData.attributes = result[0];
                }
                mongoclient.close();
            });
        });

        mongoclient.collection("action", function (err, collection) {
            var date = new Date();
            var current_moment = date.getTime();

            collection.find({
                user: userData,
                action_finishes_in: {$lte:current_moment}
            }).toArray(function (err, result) {
                var completed = [];
                for (var i = 0; i < result.length; i++) {
                    current_action = result[i].action;
                    current_action_data = ActionList[current_action];
                    Object.assign(current_action_data, result[i]);
                    completed.push(current_action_data);
                }

                res.render("completed", {completed: completed});

                mongoclient.close();
            });
        });

    });
    
};

GameDAO.prototype.revokeAction = function (_id, currentUser, res) {

    this._connection.open(function (err, mongoclient) {

        var current_action_details = [];

        mongoclient.collection("action", function (err, collection) {
            collection.find({
                id: ObjectID(_id)
            }).toArray(function (err, result) {                
                if (result.length > 0) {
                    current_action = result[0].action;
                    current_action_data = ActionList[current_action];
                    Object.assign(current_action_data, result[0]);
                    current_action_details = current_action_data;
                } else {
                    current_action_details.error = 'Action not found!';
                }
            });
        });

        console.log(current_action_details);

        /* mongoclient.collection("game", function (err, collection) {
            collection.update(
                { user: currentUser },
                { $inc: { scrolls: -1 } }
            );
        }); */

        res.redirect('game?msg=RV');

        /* mongoclient.collection("action", function (err, collection) {
            collection.remove(
                { _id: ObjectID(_id) },
                function (err, result) {
                    res.redirect('game?msg=RV');
                }
            );
        }); */

        mongoclient.close();
    });
};

GameDAO.prototype.claimAction = function (_id, res) {

    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("action", function (err, collection) {

            collection.find({
                _id: ObjectID(_id)
            }).toArray(function (err, result) {
                var current_action_details = [];
                if (result.length > 0) {
                    current_action = result[0].action;
                    current_action_data = ActionList[current_action];
                    Object.assign(current_action_data, result[0]);
                    current_action_details = current_action_data;
                } else {
                    res.redirect('game?msg=LE');
                }

                console.log(current_action_details);

                //res.render("scrolls", {actions: result});
                //
                //res.render("completed", { completed: completed });
            });

            /* collection.remove(
                { _id: ObjectID(_id)},
                function(err, result) {
                    res.redirect('game?msg=RV');
                }
            ); */

            mongoclient.close();

            res.redirect('game?msg=CL');
        });
    });
};

module.exports = function () {
    return GameDAO;
};