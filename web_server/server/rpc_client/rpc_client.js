var jayson = require('jayson');

var client = jayson.client.http({
	port: 4040,
	host: 'localhost'
});

//Test RPC method
function add(a, b, callback){
	client.request('add', [a, b], function(err, error, response){
		if(err) throw err;
		console.log(response);
		callback(response);
	});
}

// Get news summaries for a user
function getNewsSummariesForUser(user_id, page_num, callback) {
  client.request('getNewsSummariesForUser', [user_id, page_num], function(err, error, response) {
    if (err) throw err;
    console.log('getNewsSummariesForUser in rpc_client.js');
    console.log(response);
    callback(response);
  });
}

// Get news summaries for a user with topic
function getNewsSummariesForUserWithTopic(user_id, page_num, topic, callback) {
  client.request('getNewsSummariesForUserWithTopic', [user_id, page_num, topic], function(err, error, response) {
    if (err) throw err;
    console.log('getNewsSummariesForUserWithTopic in rpc_client.js');
    console.log(response); 
    callback(response);
  });
}

//Get news summaries for a user with keyword
function getNewsSummariesForUserWithKeyword(user_id, page_num, keyword, callback){
  client.request('getNewsSummariesForUserWithKeyword', [user_id, page_num, keyword], function(err, error, response){
    if(err) throw err;
    console.log('getNewsSummariesForUserWithKeyword in rpc_client.js');
    console.log(response);
    callback(response);
  })
}

// Log a news click event for a user
function logNewsClickForUser(user_id, news_id) {
    client.request('logNewsClickForUser', [user_id, news_id], function(err, error, response) {
        if (err) throw err;
        console.log(response);
    });
}

function addNewsToUserLikelist(user_id, news_id){
  console.log('addNewsToUserLikelist in rpc_client.js');
  client.request('addNewsToUserLikelist', [user_id, news_id], function(err, error, response){
    if(err) throw err;
    console.log(response);
  })
}

function removeNewsFromUserLikelist(user_id, news_id){
  console.log('removeNewsFromUserLikelist in rpc_client.js');
  client.request('removeNewsFromUserLikelist', [user_id, news_id], function(err, error, response){
    if(err) throw err;
    console.log(response);
  })
}

function getUserPreferenceModel(user_id, callback){
  client.request('getUserPreferenceModel', [user_id], function(err, error, response){
    if(err) throw err;
    console.log('getUserPreferenceModel in rpc_client.js');
    console.log(response);
    callback(response);
  })
}

function setUserPreferenceModel(user_id, data, callback){
  //console.log(data);
  client.request('setUserPreferenceModel', [user_id, data], function(err, error, response){
    if(err) throw err;
    console.log('setUserPreferenceModel in rpc_client.js');
    console.log(response);
    callback(response);
  })
}

function getNewsSummariesForUserLikeList(user_id, callback){
  client.request('getNewsSummariesForUserLikeList', [user_id], function(err, error, response){
    if(err) throw err;
    console.log('getNewsSummariesForUserLikeList in rpc_client.js');
    console.log(response);
    callback(response);
  })
}

module.exports = {
  add: add,
  getNewsSummariesForUser: getNewsSummariesForUser,
  getNewsSummariesForUserWithTopic: getNewsSummariesForUserWithTopic,
  getNewsSummariesForUserWithKeyword: getNewsSummariesForUserWithKeyword,
  logNewsClickForUser: logNewsClickForUser,
  getUserPreferenceModel: getUserPreferenceModel,
  setUserPreferenceModel: setUserPreferenceModel,
  addNewsToUserLikelist: addNewsToUserLikelist,
  removeNewsFromUserLikelist: removeNewsFromUserLikelist,
  getNewsSummariesForUserLikeList: getNewsSummariesForUserLikeList
};