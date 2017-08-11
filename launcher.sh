#!/bin/bash
fuser -k 3000/tcp
fuser -k 4040/tcp

service redis_6379 restart
service mongod start

cd ./web_server/client
npm install
npm run build &

cd ../server
npm install
# nodemon app.js &
npm start &

#cd ../../
#sudo pip install -r requirements.txt

cd ../../backend_server
python service.py &


echo "================================================================"
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

fuser -k 3000/tcp
pkill -f service.py
killall node
fuser -k 4040/tcp
#service redis_6379 stop
#service mongod stop
