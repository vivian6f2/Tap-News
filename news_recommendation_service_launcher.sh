#!/bin/bash
service redis_6379 start
service mongod start

pip install -r requirements.txt

cd news_recommendation_service
python recommendation_service.py &
python click_log_processor.py &

echo "=================================================="
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

kill $(jobs -p)
pkill -f recommendation_service.py
pkill -f click_log_processor.py