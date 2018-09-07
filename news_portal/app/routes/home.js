module.exports = function(app) {
    app.get('/', function(req, res) {
        app.app.controllers.home.home_index(app, req, res);
    });
};