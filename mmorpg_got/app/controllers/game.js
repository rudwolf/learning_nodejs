module.exports.game_index = function (application, req, res){
    if(req.session.authorized) {
        res.render('game');
    } else {
        res.render('index', {
            validation: [
                    {msg:'You need to be logged in to play the game'}
                ]
        });
    }    
};

module.exports.game_logout = function (application, req, res) {
    req.session.destroy( function(err){
        res.render("index", {validation: {}, formData: {}});
    });
};