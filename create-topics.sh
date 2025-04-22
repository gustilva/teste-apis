#!/bin/bash

echo "Waiting for Kafka to be ready..."
cub kafka-ready -b kafka:9093 1 20

echo "Creating notification-dlq topic..."
kafka-topics.sh --create --topic notification-dlq --partitions 1 --replication-factor 1 --bootstrap-server kafka:9093

echo "Topic notification-dlq created successfully."
