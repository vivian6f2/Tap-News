var express = require('express');
var router = express.Router();
var rpc_client = require('../rpc_client/rpc_client');

/* Log news click. */
router.post('/like/userId/:userId/newsId/:newsId', function(req, res, next) {
	console.log('User click like button...');
	user_id = req.params['userId'];
	news_id = decodeURIComponent(req.params['newsId']);
	//console.log(news_id);

	rpc_client.addNewsToUserLikelist(user_id, news_id);
	res.status(200);
});

/* Log news click. */
router.post('/unlike/userId/:userId/newsId/:newsId', function(req, res, next) {
	console.log('User click unlike button...');
	user_id = req.params['userId'];
	news_id = decodeURIComponent(req.params['newsId']);
	//console.log(news_id);

	rpc_client.removeNewsFromUserLikelist(user_id, news_id);
	res.status(200);
});

module.exports = router;