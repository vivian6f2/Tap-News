var client = require('./rpc_client');

//invoke add
client.add(1, 3, function(response){
	console.assert(response == 4);
});

// invoke "getNewsSummariesForUser"
client.getNewsSummariesForUser('test_user', 2, function(response){
	console.assert(response != null);
});

// invoke "logNewsClickForUser"
client.logNewsClickForUser('test_user', 'test_news');