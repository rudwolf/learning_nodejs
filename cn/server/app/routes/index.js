module.exports = function(application){
	application.get('/', function(req, res){
		res.render('xyzeta');
		/* res.format({
			html: function() {
				res.send('Bem vindo a sua app NodeJS!');
			},
			json: function() {
				var json_return = {
					body: 'Bem vindo a sua app NodeJS!'
				};
				res.json(json_return);
			}
		});*/

		
	});

	application.post('/', function (req, res) {
		res.render('xyzeta');
		//var req_data = req.body;
		//res.send(req_data);
	});
}