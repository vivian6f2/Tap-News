import json
import os
import pickle
import random
import redis
import sys
import urllib

from bson.json_util import dumps
from datetime import datetime

# import common package in parent directory
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'common'))

import mongodb_client
import news_recommendation_service_client

from CloudAMQP_client import CloudAMQPClient

import elasticsearch_client

REDIS_HOST = "localhost"
REDIS_PORT = 6379

NEWS_TABLE_NAME = "news"
CLICK_LOGS_TABLE_NAME = 'click_logs'
USER_PREFERENCE_TABLE_NAME = "user_preference_model"
USER_LIKELIST_TABLE_NAME = "user_like_list"
PREFERENCE_MODEL_TABLE_NAME = "user_preference_model"

NEWS_LIMIT = 100
NEWS_LIST_BATCH_SIZE = 10
USER_NEWS_TIME_OUT_IN_SECONDS = 60

LOG_CLICKS_TASK_QUEUE_URL = "amqp://roplnjlc:uG0WsJdOA1gG3TbbGt_eMILuZqutNN8b@donkey.rmq.cloudamqp.com/roplnjlc"
LOG_CLICKS_TASK_QUEUE_NAME = "tap-news-log-clicks-task-queue"

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT, db=0)
cloudAMQP_client = CloudAMQPClient(LOG_CLICKS_TASK_QUEUE_URL, LOG_CLICKS_TASK_QUEUE_NAME)

NUM_OF_CLASSES = 7
INITIAL_P = 1.0 / NUM_OF_CLASSES
# weight of news into like list
ALPHA = 0.3

def getNewsSummariesForUser(user_id, page_num):
    page_num = int(page_num)
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE
    end_index = page_num * NEWS_LIST_BATCH_SIZE

    # The final list of news to be returned.
    sliced_news = []

    if redis_client.get(user_id) is not None:
        news_digests = pickle.loads(redis_client.get(user_id))

        # If begin_index is out of range, this will return empty list;
        # If end_index is out of range (begin_index is within the range), this
        # will return all remaining news ids.
        sliced_news_digests = news_digests[begin_index:end_index]
        print sliced_news_digests
        db = mongodb_client.get_db()
        sliced_news = list(db[NEWS_TABLE_NAME].find({'digest':{'$in':sliced_news_digests}}))
    else:
        db = mongodb_client.get_db()
        total_news = list(db[NEWS_TABLE_NAME].find().sort([('publishedAt', -1)]).limit(NEWS_LIMIT))
        total_news_digests = map(lambda x:x['digest'], total_news)

        redis_client.set(user_id, pickle.dumps(total_news_digests))
        redis_client.expire(user_id, USER_NEWS_TIME_OUT_IN_SECONDS)

        sliced_news = total_news[begin_index:end_index]

    # Get preference for the user
    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for news in sliced_news:
        # Remove text field to save bandwidth.
        del news['text']
        if 'class' in news:
            if news['class'] == topPreference:
                news['reason'] = 'Recommend'
        if news['publishedAt'].date() == datetime.today().date():
            news['time'] = 'today'
        # whether in user like list
        user_like_list = getUserLikelist(user_id)
        if news['digest'] in user_like_list:
            news['like'] = True
        else:
            news['like'] = False
    return json.loads(dumps(sliced_news))

def getNewsSummariesForUserWithTopic(user_id, page_num, topic_name):
    page_num = int(page_num)
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE

    sliced_news = []

    # The final list of news to be returned.
    sliced_news = elasticsearch_client.getSearchResultsByKeyWithPage('class', urllib.unquote(topic_name), begin_index, NEWS_LIST_BATCH_SIZE)

    # Get preference for the user
    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for news in sliced_news:
        # Remove text field to save bandwidth.
        del news['text']
        if 'class' in news:
            if news['class'] == topPreference:
                news['reason'] = 'Recommend'
        # two format in publishAt field
        fmt1 = "%Y-%m-%dT%H:%M:%S"
        fmt2 = "%Y-%m-%dT%H:%M:%S.%f"
        if "." not in news['publishedAt']:
            publishDate = datetime.strptime(news['publishedAt'], fmt1)
        else:
            publishDate = datetime.strptime(news['publishedAt'], fmt2)
        if publishDate.date() == datetime.today().date():
            news['time'] = 'today'
        # whether in user like list
        user_like_list = getUserLikelist(user_id)
        if news['digest'] in user_like_list:
            news['like'] = True
        else:
            news['like'] = False
    return json.loads(dumps(sliced_news))

def getNewsSummariesForUserWithKeyword(user_id, page_num, keyword):
    page_num = int(page_num)
    begin_index = (page_num - 1) * NEWS_LIST_BATCH_SIZE

    sliced_news = []

    # TODO only search title
    # use post to ensure multi word search
    sliced_news = elasticsearch_client.postSearchResultsByKeyWithPage('title', urllib.unquote(keyword), begin_index, NEWS_LIST_BATCH_SIZE)

    # Get preference for the user
    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for news in sliced_news:
        # Remove text field to save bandwidth.
        del news['text']
        if 'class' in news:
            if news['class'] == topPreference:
                news['reason'] = 'Recommend'
        # two format in publishAt field
        fmt1 = "%Y-%m-%dT%H:%M:%S"
        fmt2 = "%Y-%m-%dT%H:%M:%S.%f"
        if "." not in news['publishedAt']:
            publishDate = datetime.strptime(news['publishedAt'], fmt1)
        else:
            publishDate = datetime.strptime(news['publishedAt'], fmt2)
        if publishDate.date() == datetime.today().date():
            news['time'] = 'today'
        # whether in user like list
        user_like_list = getUserLikelist(user_id)
        if news['digest'] in user_like_list:
            news['like'] = True
        else:
            news['like'] = False
    return json.loads(dumps(sliced_news))

def getNewsSummariesForUserLikeList(user_id):
    db = mongodb_client.get_db()
    res = db[USER_LIKELIST_TABLE_NAME].find({"userId":user_id})
    like_digests = {}
    for data in res:
        like_digests = data["newsIds"]

    liked_news = list(db[NEWS_TABLE_NAME].find({'digest':{'$in':like_digests}}))
    # Get preference for the user
    preference = news_recommendation_service_client.getPreferenceForUser(user_id)
    topPreference = None

    if preference is not None and len(preference) > 0:
        topPreference = preference[0]

    for news in liked_news:
        # Remove text field to save bandwidth.
        del news['text']
        if 'class' in news:
            if news['class'] == topPreference:
                news['reason'] = 'Recommend'
        if news['publishedAt'].date() == datetime.today().date():
            news['time'] = 'today'
        # whether in user like list
        user_like_list = getUserLikelist(user_id)
        if news['digest'] in user_like_list:
            news['like'] = True
        else:
            news['like'] = False
    return json.loads(dumps(liked_news))

def logNewsClickForUser(user_id, news_id):
    message = {'userId': user_id, 'newsId': news_id, 'timestamp': datetime.utcnow()}

    db = mongodb_client.get_db()
    db[CLICK_LOGS_TABLE_NAME].insert(message)

    # Send log task to machine learning service for prediction
    message = {'userId': user_id, 'newsId': news_id, 'timestamp': str(datetime.utcnow())}
    cloudAMQP_client.sendMessage(message)

def addNewsToUserLikelist(user_id, news_id):
    message = {'userId': user_id, 'newsId': news_id, 'timestamp': str(datetime.utcnow())}
    db = mongodb_client.get_db()
    try:
        db[USER_LIKELIST_TABLE_NAME].update({'userId':user_id},\
                                {'$addToSet':{'newsIds':news_id}},\
                                upsert=True)
    except:
        return 'ERROR: addNewsToUserLikelist'

    # modified user preference
    likedNews = db[NEWS_TABLE_NAME].find({'digest':news_id})
    for data in likedNews:
        click_class = data['class']
    # Update user's preference
    model = db[PREFERENCE_MODEL_TABLE_NAME].find_one({'userId': user_id})
    # If model not exists, create a new one
    if model is None:
        print 'Creating preference model for new user: %s' % user_id
        new_model = {'userId' : user_id}
        preference = {}
        for i in news_classes.classes:
            preference[i] = float(INITIAL_P)
        new_model['preference'] = preference
        model = new_model
    print 'Updating preference model for new user: %s' % user_id
    # Update the clicked one.
    old_p = model['preference'][click_class]
    model['preference'][click_class] = float((1 - ALPHA) * old_p + ALPHA)
    # Update not clicked classes.
    for i, prob in model['preference'].iteritems():
        if not i == click_class:
            model['preference'][i] = float((1 - ALPHA) * model['preference'][i])

    db[PREFERENCE_MODEL_TABLE_NAME].replace_one({'userId': user_id}, model, upsert=True)

    return 'ok'

def removeNewsFromUserLikelist(user_id, news_id):
    db = mongodb_client.get_db()
    try:
        # if not exist, do nothing
        db[USER_LIKELIST_TABLE_NAME].update({'userId':user_id},\
                                {'$pull':{'newsIds':news_id}})
    except:
        return 'ERROR: removeNewsFromUserLikelist'
    #
    # # modified user preference
    # click_class = db[NEWS_TABLE_NAME].find({'digest':news_id})['class']
    # # Update user's preference
    # model = db[PREFERENCE_MODEL_TABLE_NAME].find_one({'userId': userId})
    # # If model not exists, create a new one
    # if model is None:
    #     print 'Creating preference model for new user: %s' % userId
    #     new_model = {'userId' : userId}
    #     preference = {}
    #     for i in news_classes.classes:
    #         preference[i] = float(INITIAL_P)
    #     new_model['preference'] = preference
    #     model = new_model
    # print 'Updating preference model for new user: %s' % userId
    # # Update the clicked one.
    # old_p = model['preference'][click_class]
    # model['preference'][click_class] = float((1 - ALPHA) * old_p + ALPHA)
    # # Update not clicked classes.
    # for i, prob in model['preference'].iteritems():
    #     if not i == click_class:
    #         model['preference'][i] = float((1 - ALPHA) * model['preference'][i])
    #
    # db[PREFERENCE_MODEL_TABLE_NAME].replace_one({'userId': userId}, model, upsert=True)

    return 'ok'


def getUserLikelist(user_id):
    db = mongodb_client.get_db()
    res = db[USER_LIKELIST_TABLE_NAME].find({"userId":user_id})
    like_list = {}
    for data in res:
        like_list = data["newsIds"]

    return json.loads(dumps(like_list))

def getUserPreferenceModel(user_id):
    db = mongodb_client.get_db()
    user_prefer = list(db[USER_PREFERENCE_TABLE_NAME].find({"userId":user_id}))
    preference_list = {}
    for data in user_prefer:
        preference_list = data["preference"]

    # TODO if no data create  -> find from click log.py OR fontend show no progress

    return json.loads(dumps(preference_list))

def setUserPreferenceModel(user_id, data):

    db = mongodb_client.get_db()
    try:
        db[USER_PREFERENCE_TABLE_NAME].replace_one({'userId': user_id},\
                {"userId":user_id,"preference":data}, upsert=True)
    except:
        # print 'ERROR: setUserPreferenceModel'
        return 'ERROR: setUserPreferenceModel'

    return "Preference Setup Successfully"
