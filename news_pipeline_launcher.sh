#!/bin/bash
service redis_6379 start
service mongod start

pip install -r requirements.txt

cd news_topic_modeling_service/server
python server.py &

cd ../../news_pipeline
python news_monitor.py &
python news_fetcher.py &
python news_deduper.py &

echo "=================================================="
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

kill $(jobs -p)
pkill -f news_monitor.py
pkill -f news_fetcher.py
pkill -f news_deduper.py
pkill -f server.py