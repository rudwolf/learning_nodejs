module.exports = function(application){
	application.get('/game', function(req, res){
		application.app.controllers.game.game_index(application, req, res);
	});

	application.get('/subjects', function (req, res) {
		application.app.controllers.game.game_ajax_subjects(application, req, res);
	});

	application.get('/scrolls', function (req, res) {
		application.app.controllers.game.game_ajax_scrolls(application, req, res);
	});

	application.get('/logout', function (req, res) {
		application.app.controllers.game.game_logout(application, req, res);
	});


}