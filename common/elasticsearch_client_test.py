import elasticsearch_client
import urllib

def test_elasticsearch_basic():
	test = "World"
	news = elasticsearch_client.getSearchResultsByKey('class', test)
	# print news
	assert len(news) > 0
	print 'test_elasticsearch_basic passed!'

def test_elasticsearch_paging():
	test = "World"
	news = elasticsearch_client.getSearchResultsByKeyWithPage('class', test, 2, 10)
	print news

def test_post_elasticsearch_paging():
	test = "trump lawyer"
	news = elasticsearch_client.postSearchResultsByKeyWithPage('title', test, 1, 10)
	print news

if __name__ == "__main__":
	# test_elasticsearch_basic()
	# test_elasticsearch_paging()
	test_post_elasticsearch_paging()
