import requests

from json import loads
from json import dumps

SEARCH_API_ENDPOINT = "http://localhost:9200"
SEARCH_INDEX_NAME = "/tap-news"


def buildUrl(end_point=SEARCH_API_ENDPOINT, api_name=SEARCH_INDEX_NAME):
    return end_point + api_name + "/_search"

# useless
def getSearchResultsByKey(field_name, field_value):
    response = requests.get(buildUrl() + "?q=" + field_name + ":" + field_value)
    res_json = loads(response.content)
    articles = []

    if (res_json is not None and
        res_json['hits']['total'] != 0):
        # found something!
        # print res_json['hits']
        for news in res_json['hits']['hits']:
            # print news
            articles.append(news['_source'])

    return articles

def getSearchResultsByKeyWithPage(field_name, field_value, from_page, page_size):
    # newest first
    sort_rule = "&sort=publishedAt:desc"
    url = buildUrl() + "?q=" + field_name + ":" + \
        field_value + "&from=" + str(from_page) + "&size=" + str(page_size) + \
        sort_rule
    response = requests.get(url)
    res_json = loads(response.content)
    articles = []

    if (res_json is not None and
        res_json['hits']['total'] != 0):
        # found something!
        # print res_json['hits']
        for news in res_json['hits']['hits']:
            # print news
            articles.append(news['_source'])

    return articles

def postSearchResultsByKeyWithPage(field_name, field_value, from_page, page_size):
    # newest first
    req_data = {}

    req_data["from"] = from_page
    req_data["size"] = page_size
    req_data["sort"] = [{ "publishedAt" : {"order" : "desc"} }]
    req_data["query"] = {"query_string": { \
                        "fields" : [field_name], "query": field_value.replace(" ", " AND ") }}
    req_headers = {'Content-type': 'application/json'}

    response = requests.post(buildUrl(), data = dumps(req_data), headers = req_headers)
    res_json = loads(response.content)
    articles = []

    if (res_json is not None and
        res_json['hits']['total'] != 0):
        # found something!
        # print res_json['hits']
        for news in res_json['hits']['hits']:
            # print news
            articles.append(news['_source'])

    return articles

# def getSearchResultsByKeys({field_name:field_value}, from_page, page_size):
