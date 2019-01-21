module.exports.home_index = function(app, req, res) {
    var conn = app.config.db_conn();
    var newsDAO = new app.app.models.newsDAO(conn);

    newsDAO.getLastNews(function(error, qry_result){
        res.render('home/index', {news: qry_result});
    });

    
};