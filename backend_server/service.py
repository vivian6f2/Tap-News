import operations
import pyjsonrpc

SERVER_HOST = 'localhost'
SERVER_POST = 4040

class RequestHandler(pyjsonrpc.HttpRequestHandler):
	""" Test Method """
	@pyjsonrpc.rpcmethod
	def add(self, a, b):
		print "add is called with %d and %d" % (a, b)
		return a + b

	""" Get news summaries for user """
	@pyjsonrpc.rpcmethod
	def getNewsSummariesForUser(self, user_id, page_num):
		return operations.getNewsSummariesForUser(user_id, page_num)

	""" Get news summaries for user """
	@pyjsonrpc.rpcmethod
	def getNewsSummariesForUserWithTopic(self, user_id, page_num, topic):
		return operations.getNewsSummariesForUserWithTopic(user_id, page_num, topic)

	""" Get news summaries with keyword """
	@pyjsonrpc.rpcmethod
	def getNewsSummariesForUserWithKeyword(self, user_id, page_num, keyword):
		return operations.getNewsSummariesForUserWithKeyword(user_id, page_num, keyword)

	""" Get news summaries for user's like list """
	@pyjsonrpc.rpcmethod
	def getNewsSummariesForUserLikeList(self, user_id):
		return operations.getNewsSummariesForUserLikeList(user_id)

	""" Log user news clicks """
	@pyjsonrpc.rpcmethod
	def logNewsClickForUser(self, user_id, news_id):
		return operations.logNewsClickForUser(user_id, news_id)

	""" Add news to like list """
	@pyjsonrpc.rpcmethod
	def addNewsToUserLikelist(self, user_id, news_id):
		return operations.addNewsToUserLikelist(user_id, news_id)

	""" Remove news to like list """
	@pyjsonrpc.rpcmethod
	def removeNewsFromUserLikelist(self, user_id, news_id):
		return operations.removeNewsFromUserLikelist(user_id, news_id)

	""" Get news to like list """
	@pyjsonrpc.rpcmethod
	def getUserLikelist(self, user_id):
		return operations.getUserLikelist(user_id)

	""" Get user preference of each class """
	@pyjsonrpc.rpcmethod
	def getUserPreferenceModel(self, user_id):
		return operations.getUserPreferenceModel(user_id)

	""" Set user preference of each class """
	@pyjsonrpc.rpcmethod
	def setUserPreferenceModel(self, user_id, data):
		return operations.setUserPreferenceModel(user_id, data)


# Threading HTTP Server
http_server = pyjsonrpc.ThreadingHttpServer(
	server_address = (SERVER_HOST, SERVER_POST),
	RequestHandlerClass = RequestHandler
)

print "Starting HTTP server on %s:%d" % (SERVER_HOST, SERVER_POST)

http_server.serve_forever();
