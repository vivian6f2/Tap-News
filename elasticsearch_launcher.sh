#!/bin/bash
service mongod stop
mongod --replSet "rs0"
service mongod start

cd ~/elasticsearch-5.5.0/bin
./elasticsearch

mongo-connector -m localhost:27017 -t localhost:9200 -d elastic2_doc_manager



