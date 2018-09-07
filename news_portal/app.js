var app = require('./config/server');

//var routes_news = require('./app/routes/news')(app);

//var routes_home = require('./app/routes/home')(app);

app.listen(3000, function() {
    var currentdate = new Date(); 
    var datetime = "Last Sync: " + currentdate.getDate() + "/" + (currentdate.getMonth()+1)  + "/" + currentdate.getFullYear() + " @ "  + currentdate.getHours() + ":" + currentdate.getMinutes() + ":"  + currentdate.getSeconds();
    console.log(datetime+'\nRoda, Roda, Rodando! - by SS');
});