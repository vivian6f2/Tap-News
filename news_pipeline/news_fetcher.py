# -*- coding: utf-8 -*

import os
import sys
from newspaper import Article

# Import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'scrapers'))

import cnn_news_scraper
from CloudAMQP_client import CloudAMQPClient

SLEEP_TIME_IN_SECONDS = 5
SCRAPE_NEWS_TASK_QUEUE_URL = 'amqp://vtrjgcrd:yjU2BhDFzpBoMMs3vMFOhwXIvlmXEvIP@donkey.rmq.cloudamqp.com/vtrjgcrd'
SCRAPE_NEWS_TASK_QUEUE_NAME = 'tap-news-scrape-news-task-queue'
DEDUPE_NEWS_TASK_QUEUE_URL = 'amqp://euewnrzh:ADFtJHEu6VQcew_sygLlrqAMWgQsnO3m@fish.rmq.cloudamqp.com/euewnrzh'
DEDUPE_NEWS_TASK_QUEUE_NAME = 'tap-news-dedupe-news-task-queue'

scrape_news_queue_client = CloudAMQPClient(SCRAPE_NEWS_TASK_QUEUE_URL, SCRAPE_NEWS_TASK_QUEUE_NAME)
dedupe_news_queue_client = CloudAMQPClient(DEDUPE_NEWS_TASK_QUEUE_URL, DEDUPE_NEWS_TASK_QUEUE_NAME)

def handle_message(msg):
	if msg is None or not isinstance(msg, dict):
		print 'message is broken'
		return

	task = msg
	text = None

	article = Article(task['url'])
	article.download()
	article.parse()

	task['text'] = article.text
	dedupe_news_queue_client.sendMessage(task)


while True:
	if scrape_news_queue_client is not None:
		msg = scrape_news_queue_client.getMessage()
		if msg is not None:
			# Parse and process the task
			try:
				handle_message(msg)
			except Exception as e:
				print e
				pass
		scrape_news_queue_client.sleep(SLEEP_TIME_IN_SECONDS)