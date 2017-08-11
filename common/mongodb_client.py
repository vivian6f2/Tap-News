# -*- coding: utf-8 -*

# Don't forget to run MongoDB!!
# sudo service mongod start

from pymongo import MongoClient

MONGO_DB_HOST = 'localhost'
MONGO_DB_PORT = 27017
DB_NAME = 'tap-news'

client = MongoClient("%s:%s" %(MONGO_DB_HOST, MONGO_DB_PORT))

def get_db(db=DB_NAME):
	db = client[db]
	return db