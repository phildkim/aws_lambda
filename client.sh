#!/bin/bash
PATH=$PATH:.
client() {
  # $userId: first parameter
  # $heartRate: random integer [0-250]
  # $invokeUrl: calls the API using curl to
  #             Invoke URL with $userid and $heartrate
  local -i userid=$1
  local -i heartrate=$((RANDOM%250))
  invokeurl=$(curl --write-out " HTTP %{http_code}" "https://k8489hgf66.execute-api.us-west-1.amazonaws.com/test/heartrate?userid=$userid&heartrate=$heartrate" --silent)
  echo $invokeurl
}
# $perMinute: 60 seconds divided by second parameter
#             to get seconds for each insert
seconds=60
perMinute=$(( ($seconds / $2) ))
echo "$perMinute inserts into DynamoDB per minute"
(for (( i=0; i<$seconds; ++i )); do
  sleep 1 &
  if [[ $(($i % $perMinute)) -eq 0 ]]; then
    printf "\t\t\t  $i seconds - $(date) \r"
    # client $1: for userId
    client $1
  fi
  wait
done)