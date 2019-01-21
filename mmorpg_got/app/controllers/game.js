module.exports.game_index = function (application, req, res){
    if(req.session.authorized !== true) {
        res.render('index', {
            validation: [
                { msg: 'You need to be logged in to play the game' }
            ]
        });
        return;
    }

    msg = '';
    if (req.query.msg !== '') {
        msg = req.query.msg;
    }

    //console.log(msg);

    var connection = application.config.dbConnection;
    var GameDAO = new application.app.models.GameDAO(connection);
    GameDAO.startGame(req, res, msg);
};

module.exports.game_logout = function (application, req, res) {
    req.session.hasLogout = true;
    res.redirect('/');
};

module.exports.game_ajax_subjects = function (application, req, res) {
    if (req.session.authorized !== true) {
        res.render('index', {
            validation: [
                { msg: 'You need to be logged in to play the game' }
            ]
        });
        return;
    }

    res.render("subjects", {});    
};

module.exports.game_ajax_completed = function (application, req, res) {
    if (req.session.authorized !== true) {
        res.send('You need to be logged in to play the game');
        return;
    }

    var connection = application.config.dbConnection;
    var GameDAO = new application.app.models.GameDAO(connection);

    var userData = req.session.user;
    GameDAO.getCompleted(userData, res);
};

module.exports.game_ajax_scrolls = function (application, req, res) {
    if (req.session.authorized !== true) {
        res.send('You need to be logged in to play the game');
        return;
    }

    var connection = application.config.dbConnection;
    var GameDAO = new application.app.models.GameDAO(connection);

    var user = req.session.user;
    GameDAO.getActions(user, res);

};

module.exports.game_new_subject_order = function (application, req, res) {
    if (req.session.authorized !== true) {
        res.send('You need to be logged in to play the game');
        return;
    }

    var formData = req.body;

    req.assert('action', 'Action cannot be empty!').notEmpty();
    req.assert('amount', 'Amount cannot be empty').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        // res.render('register', { validation: errors, formData: formData });
        res.redirect('game?msg=CE');
        return;
    }

    var connection = application.config.dbConnection;
    var GameDAO = new application.app.models.GameDAO(connection);
    formData.user = req.session.user;
    GameDAO.subjectAction(formData, req, res);
    return;
};

module.exports.game_revoke_order = function (application, req, res) {
    var url_query = req.query;

    var connection = application.config.dbConnection;
    var GameDAO = new application.app.models.GameDAO(connection);

    var currentUser = req.session.user;
    var _id = url_query.action_id;

    GameDAO.revokeAction(_id, currentUser, res);
    
    return;
};

module.exports.game_claim_order = function (application, req, res) {
    var url_query = req.query;

    var connection = application.config.dbConnection;
    var GameDAO = new application.app.models.GameDAO(connection);

    var _id = url_query.action_id;

    GameDAO.claimAction(_id, res);
    //res.redirect('game?msg=AR');
    return;
};