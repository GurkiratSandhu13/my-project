#!/bin/bash

# Route manifest diagnostic script
# Prints all registered Express routes

API_URL="http://localhost:4000"

echo "=== Route Manifest ==="
echo "Fetching routes from $API_URL/__routes..."
echo ""

curl -s "$API_URL/__routes" | jq '.' || {
  echo "Error: Failed to fetch routes or jq not installed"
  echo "Raw response:"
  curl -s "$API_URL/__routes"
  exit 1
}

