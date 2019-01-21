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

	application.get('/completed', function (req, res) {
		application.app.controllers.game.game_ajax_completed(application, req, res);
	});

	application.post('/new_subject_order', function (req, res) {
		application.app.controllers.game.game_new_subject_order(application, req, res);
	});

	application.get('/revoke_order', function (req, res) {
		application.app.controllers.game.game_revoke_order(application, req, res);
	});

	application.get('/claim_order', function (req, res) {
		application.app.controllers.game.game_claim_order(application, req, res);
	});

	application.get('/logout', function (req, res) {
		application.app.controllers.game.game_logout(application, req, res);
	});

};