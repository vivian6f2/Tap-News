# -*- coding: utf-8 -*

import requests

from json import loads

NEWS_API_KEY = 'b8227eb129cc4568a7dea45d2f0ddefb'
NEWS_API_ENDPOINT = 'https://newsapi.org/v1/'
ARTICLES_API = 'articles'
SOURCES_API = 'sources'

CNN = 'cnn'
BBC = 'bbc'
DEFAULT_SOURCES = [CNN]

SORT_BY_TOP = 'top'

def buildURL(end_point=NEWS_API_ENDPOINT, api_name=ARTICLES_API):
	return end_point + api_name

def getNewsFromSource(sources=DEFAULT_SOURCES, sortBy=SORT_BY_TOP):
	articles = []
	for source in sources:
		payload = {
			'source' : source,
			'apiKey' : NEWS_API_KEY,
			'sortBy' : sortBy
		}
		response = requests.get(buildURL(), params=payload)
		res_json = loads(response.content)

		# Extract news from response (res_josn)
		if (res_json is not None and 
			res_json['status'] == 'ok' and
			res_json['source'] is not None):
			# Populate news source in each article
			for news in res_json['articles']:
				news['source'] = res_json['source'];

			articles.extend(res_json['articles']);

	return articles