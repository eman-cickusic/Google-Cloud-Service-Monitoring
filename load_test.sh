#!/bin/bash
# Basic load testing script for GCP Service Monitoring project

# Check if project ID is provided
if [ -z "$1" ]; then
  echo "Please provide your GCP project ID as an argument"
  echo "Usage: ./load-test.sh your-project-id [requests-per-second]"
  exit 1
fi

PROJECT_ID=$1
RPS=${2:-10}  # Default to 10 requests per second if not specified
SLEEP_TIME=$(bc <<< "scale=3; 1/$RPS")

echo "Starting load test on https://$PROJECT_ID.appspot.com/random-error"
echo "Sending approximately $RPS requests per second"
echo "Press Ctrl+C to stop the test"

# Counter variables
total_requests=0
successful_requests=0
error_requests=0

# Function to print stats
print_stats() {
  local success_rate=0
  if [ $total_requests -gt 0 ]; then
    success_rate=$(bc <<< "scale=2; $successful_requests*100/$total_requests")
  fi
  
  echo "========== Stats =========="
  echo "Total requests: $total_requests"
  echo "Successful: $successful_requests"
  echo "Errors: $error_requests"
  echo "Success rate: $success_rate%"
  echo "=========================="
}

# Handle interrupt
trap 'echo -e "\nTest stopped"; print_stats; exit 0' INT

# Main loop
while true; do
  # Make request and capture status code
  status_code=$(curl -s -o /dev/null -w "%{http_code}" https://$PROJECT_ID.appspot.com/random-error)
  
  # Increment counters
  total_requests=$((total_requests+1))
  
  if [ "$status_code" -eq 200 ]; then
    successful_requests=$((successful_requests+1))
    echo -n "."  # Success indicator
  else
    error_requests=$((error_requests+1))
    echo -n "E"  # Error indicator
  fi
  
  # Print stats every 100 requests
  if [ $((total_requests % 100)) -eq 0 ]; then
    echo ""
    print_stats
  fi
  
  # Sleep for calculated time
  sleep $SLEEP_TIME
done
