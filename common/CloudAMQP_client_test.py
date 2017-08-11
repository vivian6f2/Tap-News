from CloudAMQP_client import CloudAMQPClient

CLOUDAMQP_URL = 'amqp://vgxujdxl:1XRwPwDVVPVNjBOv2Q5U3CKUgxqeqlmH@donkey.rmq.cloudamqp.com/vgxujdxl'
QUEUE_NAME = 'test'

def test_basic():
	client = CloudAMQPClient(CLOUDAMQP_URL, QUEUE_NAME)

	sentMsg = {'test_key': 'test_value'}
	client.sendMessage(sentMsg)
	client.sleep(5)
	receivedMsg = client.getMessage()
	assert sentMsg == receivedMsg
	print "test_basic passed!" 

if __name__ == '__main__':
	test_basic()

