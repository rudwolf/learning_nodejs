module.exports.register_new = function(application, req, res){
    res.render('register', { validation: {}, formData: {} });
};

module.exports.register_save = function (application, req, res) {
    var formData = req.body;

    req.assert('name', 'Name cannot be empty').notEmpty();
    req.assert('user', 'User cannot be empty').notEmpty();
    req.assert('password', 'Password cannot be empty').notEmpty();
    req.assert('house', 'Please choose your House').notEmpty();

    var errors = req.validationErrors();
    if(errors) {
        res.render('register', {validation: errors, formData: formData});
        return;
    }

    var connection = application.config.dbConnection;

    //console.log(connection);

    var UsersDAO = new application.app.models.UsersDAO(connection);
    var GameDAO = new application.app.models.GameDAO(connection);

    UsersDAO.insertUser(formData);
    GameDAO.generateAttributes(formData.user);

    //Redirect to login with success message
    res.render('index', {validation: [], registrationSuccess: true});
    return;
};