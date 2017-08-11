import os
import random
import requests
from lxml import html

USER_AGENTS_FILE = os.path.join(os.path.dirname(__file__), 'user_agents.txt')
USER_AGENTS = []

GET_CNN_NEWS_XPATH = "//p[@class='zn-body__paragraph speakable']//text() | //div[@class='zn-body__paragraph speakable']//text() | //div[@class='zn-body__paragraph']//text()"

with open(USER_AGENTS_FILE, 'rb') as uaf:
	for ua in uaf.readlines():
		if ua:
			USER_AGENTS.append(ua.strip()[1:-1])

def getHeaders():
	# Pretend it is a request from browser
	ua = random.choice(USER_AGENTS) # Select a random user agent
	headers = {
		"Connection" : "close",
		"User-Agent" : ua
	}

def extract_news(news_url):
	session_requests = requests.session()
	response = session_requests.get(news_url, headers=getHeaders())

	news = {}

	try:
		tree = html.fromstring(response.content)
		news = tree.xpath(GET_CNN_NEWS_XPATH)
		news = ''.join(news)
	except Exception:
		return {}

	return news