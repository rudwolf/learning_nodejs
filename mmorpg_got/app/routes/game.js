module.exports = function(application){
	application.get('/game', function(req, res){
		application.app.controllers.game.game_index(application, req, res);
	});
}