module.exports = function(app) {

    app.get('/news-single', function(req, res) {

        var conn = app.config.db_conn();
        var newsDAO = new app.app.models.newsDAO(conn);

        newsDAO.getSingle(function(error, result) {
            //res.send(result);
            res.render('noticias/noticia', {news: result});
        });

    });
    
};