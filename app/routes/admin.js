module.exports = function(app) {
    app.get('/news/add', function(req, res) {
        res.render('admin/news_add');
    });

    app.post('/news/save', function(req, res) {
        var news_body = req.body;

        req.assert('title','Título é obrigatório').notEmpty();
        req.assert('excerpt','Resumo é obrigatório').notEmpty();
        req.assert('excerpt','Resumo deve conter entre 10 e 100 caracpléstis').len(10, 100);
        req.assert('author','Autor é obrigatório').notEmpty();
        req.assert('published_at','Data de publicação meu caro! CadÊ?').notEmpty().isDate({format: 'YYYY-MM-DD'});
        req.assert('text','Notícia é obrigatória').notEmpty();

        var errors = req.validationErrors();
        
        if(errors) {
            res.render('admin/news_add');
            return;
        }

        var conn = app.config.db_conn();
        var newsDAO = new app.app.models.newsDAO(conn);

        newsDAO.save(news_body, function(error, result) {
            //res.send(result);
            if (error) { 
                res.status(404).json({"error":"not found","err":error});
                return;
            }
            res.redirect('/news');
        });

    });
};