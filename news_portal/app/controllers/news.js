module.exports.news_list = function(app, req, res) {
    var conn = app.config.db_conn();
    var newsDAO = new app.app.models.newsDAO(conn);

    newsDAO.getAll(function(error, result) {            
        res.render('noticias/noticias', {news: result});
    });
};

module.exports.news_single = function(app, req, res) {
    var conn = app.config.db_conn();
    var newsDAO = new app.app.models.newsDAO(conn);
    
    news_id = req.params.id;

    newsDAO.getSingle(news_id, function(error, result) {
        //res.send(result);
        res.render('noticias/noticia', {news: result});
    });
};