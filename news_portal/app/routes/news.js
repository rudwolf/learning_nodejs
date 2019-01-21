module.exports = function(app) {
    app.get('/news', function(req, res) {        
        app.app.controllers.news.news_list(app, req, res);
    });
    /* app.get('/news/single', function(req, res) {
        app.app.controllers.news.news_single(app, req, res);
    }); */
    app.get('/news/:id', function(req, res) {        
        app.app.controllers.news.news_single(app, req, res);
    });
};