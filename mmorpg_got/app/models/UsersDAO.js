function UsersDAO(connection) {
    this._connection = connection();
}

UsersDAO.prototype.insertUser = function(user) {
    this._connection.open( function(err, mongoclient) {
        mongoclient.collection("users", function(err, collection){
            collection.insert(user);
            mongoclient.close();
        });        
    });
}

UsersDAO.prototype.login = function (user, req, res) {
    this._connection.open(function (err, mongoclient) {
        mongoclient.collection("users", function (err, collection) {
            collection.find(user).toArray(function(err, result) {
                if(undefined != result[0]){
                    req.session.authorized = true;
                    req.session.user = result[0].user;
                    req.session.house = result[0].house;
                }
                if(req.session.authorized) {
                    res.redirect('game');
                } else {
                    res.render('index', {validation: [{msg: 'User or passowrd do not match'}]});
                }
            });
            mongoclient.close();
        });        
    });
};

module.exports = function () {
    return UsersDAO;
}