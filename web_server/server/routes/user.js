var express = require('express');
var router = express.Router();
var rpc_client = require('../rpc_client/rpc_client');

router.get('/preferenceModel/userId/:userId', function(req, res, next) {
	console.log('Getting preference model...');
	var user_id = req.params['userId'];

	rpc_client.getUserPreferenceModel(user_id, function(response){
		console.log('getUserPreferenceModel in news.js');
		res.json(response);
	});
});

router.post('/setPreferenceModel/userId/:userId', function(req, res, next) {
	console.log('Sending preference model...');
	var user_id = req.params['userId'];
	//console.log(req.body);
	var data = {};
	var sum = 0;
	for(var i in req.body['preference']){
		var field = req.body['preference'][i][0];
		data[field] = req.body['preference'][i][1];
		sum = sum + data[field];
	}
	for(var i in req.body['preference']){
		var field = req.body['preference'][i][0];
		data[field] = data[field] / sum;
	}

	//console.log(data);

	rpc_client.setUserPreferenceModel(user_id, data, function(response){
		console.log('setUserPreferenceModel in news.js');
		res.json(response);
	});
});


module.exports = router;