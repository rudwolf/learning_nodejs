module.exports = function(app) {

    app.get('/news', function(req, res) {

        var conn = app.config.db_conn();
        var newsDAO = new app.app.models.newsDAO(conn);

        newsDAO.getAll(function(error, result) {            
            res.render('noticias/noticias', {news: result});
        });

    });
    
};