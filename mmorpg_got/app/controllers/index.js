module.exports.home = function(application, req, res){
    res.render('index', { validation: {}, formData: {}});
};

module.exports.login = function (application, req, res) {
    var formData = req.body;
    
    req.assert('user', 'User cannot be empty').notEmpty();
    req.assert('password', 'Password cannot be empty').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.render('index', { validation: errors, formData: formData });
        return;
    }

    var connection = application.config.dbConnection;
    var UsersDAO = new application.app.models.UsersDAO(connection);

    UsersDAO.login(formData, req, res);

    //res.send('testing login...');
};