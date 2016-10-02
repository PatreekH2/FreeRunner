var path = require('path');

module.exports = function(app, db){
	

	app.get('/multiplayer/room/:lobbyid', function(req, res){
		/*console.log(req.params.lobbyid);*/
		res.sendFile(path.join(__dirname + '/../../public/freeRunnerMulti.html'));
	});

/*	app.get('/multiplayer', function(req, res){
		res.sendFile(path.join(__dirname + '/../../public/freeRunnerMulti.html'));
	});*/

	app.use(function(req, res){
		res.sendFile(path.join(__dirname + '/../../public/freeRunner.html'));
	});
};