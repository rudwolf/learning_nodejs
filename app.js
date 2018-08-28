var app = require('./config/server');

//var routes_news = require('./app/routes/news')(app);

//var routes_home = require('./app/routes/home')(app);

app.listen(3000, function() {
    console.log('Roda, Roda, Rodando! - by SS');
});