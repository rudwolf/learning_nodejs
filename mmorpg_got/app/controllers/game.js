module.exports.game_index = function (application, req, res){
    if(req.session.authorized !== true) {
        res.render('index', {
            validation: [
                { msg: 'You need to be logged in to play the game' }
            ]
        });
        return;
    }

    var connection = application.config.dbConnection;
    var GameDAO = new application.app.models.GameDAO(connection);
    GameDAO.startGame(req, res);
};

module.exports.game_logout = function (application, req, res) {
    req.session.destroy( function(err){
        res.render("index", {validation: {}, formData: {}});
    });
};

module.exports.game_ajax_subjects = function (application, req, res) {
    res.render("subjects", {});    
};

module.exports.game_ajax_scrolls = function (application, req, res) {
    res.render("scrolls", {});
};