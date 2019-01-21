module.exports = function(app) {
    app.get('/news/add', function(req, res) {
        //res.render('admin/news_add', {validation: {}, news_body: {}});
        app.app.controllers.admin.news_add(app, req, res);
    });

    app.post('/news/save', function(req, res) {
        app.app.controllers.admin.news_save(app, req, res);
    });
};