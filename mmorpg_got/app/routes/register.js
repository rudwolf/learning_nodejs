module.exports = function(application){
	application.get('/register', function(req, res){
		application.app.controllers.register.new(application, req, res);
	});
}