module.exports = function(application){
	application.get('/register', function(req, res){
		application.app.controllers.register.register_new(application, req, res);
	});

	application.post('/register/save', function (req, res) {
		application.app.controllers.register.register_save(application, req, res);
	});
}