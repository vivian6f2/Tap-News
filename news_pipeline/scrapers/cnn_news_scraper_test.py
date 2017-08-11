import cnn_news_scraper as scraper 

EXPECTED_NEWS = "During the rainy season on the southern Philippines island of Mindanao, storms are foreshadowed by flashes of lightning in the distance, visible above the treetops."
CNN_NEWS_URL = "http://www.cnn.com/2017/06/25/asia/philippines-marawi-isis/index.html"

def test_basic():
	news = scraper.extract_news(CNN_NEWS_URL)

	print news
	assert EXPECTED_NEWS in news

	print 'test_basic passed!'

if __name__ == '__main__':
	test_basic()