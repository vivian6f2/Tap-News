elasticsearch &

mongo-connector -m localhost:27017 -t localhost:9200 -d elastic2_doc_manager &

echo "=================================================="
read -p "PRESS [ENTER] TO TERMINATE PROCESSES." PRESSKEY

kill $(jobs -p)
