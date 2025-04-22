#!/bin/bash

# Script to start all NestJS microservices
# Usage: ./start-api.sh [environment]

ENVIRONMENT=${1:-development}
echo "Starting microservices in $ENVIRONMENT environment..."

# Function to handle errors
handle_error() {
  echo "ERROR: $1"
  exit 1
}

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
  handle_error "pnpm is not installed. Please install it using 'npm install -g pnpm'."
fi

# Check if nx is installed
if ! pnpm nx --version &> /dev/null; then
  handle_error "NX is not installed. Please install it using 'pnpm add -g nx'."
fi

# Check if the nx workspace exists
if [ ! -f "nx.json" ]; then
  handle_error "NX workspace not found. Please run this script from your project root."
fi

# Define services to start
SERVICES=("api-gateway" "auth" "notification")

# Function to start a service
start_service() {
  local service=$1
  local env=$2
  local log_file="logs/${service}.log"

  echo "Starting $service service..."

  # Create logs directory if it doesn't exist
  mkdir -p logs

  # Check if the service exists
  if pnpm nx show project $service &> /dev/null; then
    # Start the service in background and redirect output to log file
    NODE_ENV=$env pnpm nx serve $service --prod=false > $log_file 2>&1 &

    # Save the PID to a file
    echo $! > "logs/${service}.pid"
    echo "$service started with PID $! (logs in $log_file)"

    # Give it a moment to start
    sleep 2

    # Check if the service is actually running
    if ! ps -p $! > /dev/null; then
      echo "WARNING: $service failed to start. Check logs at $log_file"
    fi
  else
    echo "WARNING: $service project not found in NX workspace"
  fi
}

# Function to stop all services
stop_services() {
  echo "Stopping all microservices..."

  for service in "${SERVICES[@]}"; do
    if [ -f "logs/${service}.pid" ]; then
      pid=$(cat "logs/${service}.pid")
      if ps -p $pid > /dev/null; then
        echo "Stopping $service (PID: $pid)..."
        kill $pid
      else
        echo "$service is not running"
      fi
      rm "logs/${service}.pid"
    fi
  done

  echo "All services stopped"
}

# Handle script termination
trap stop_services EXIT INT TERM

# Clear logs directory
rm -rf logs
mkdir -p logs

# Start all services
for service in "${SERVICES[@]}"; do
  start_service $service $ENVIRONMENT
done

echo "All microservices started. Press Ctrl+C to stop all services."
echo "Tail logs with: tail -f logs/<service-name>.log"

# Keep the script running to keep the services running
wait
