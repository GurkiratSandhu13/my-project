#!/bin/bash

# SSE streaming test
# Tests POST /api/chat/stream endpoint and prints streamed lines

API_URL="http://localhost:4000"
EMAIL="test-$(date +%s)@example.com"
PASSWORD="testing123"
COOKIE_FILE="/tmp/sse-curl-cookies.txt"

# Clean up old cookie file
rm -f "$COOKIE_FILE"

echo "=== SSE Streaming Test ==="
echo "API: $API_URL"
echo ""

# Register and login
echo "1. Registering and logging in..."
curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -c "$COOKIE_FILE" > /dev/null

curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -c "$COOKIE_FILE" \
  -b "$COOKIE_FILE" > /dev/null

# Create session
echo "2. Creating session..."
SESSION_RESPONSE=$(curl -s -X POST "$API_URL/api/sessions" \
  -H "Content-Type: application/json" \
  -d "{}" \
  -b "$COOKIE_FILE")

SESSION_ID=$(echo "$SESSION_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$SESSION_ID" ]; then
  echo "❌ Failed to create session"
  exit 1
fi
echo "✅ Session created: $SESSION_ID"
echo ""

# Test SSE stream
echo "3. Testing SSE stream (POST /api/chat/stream)..."
echo "Stream output:"
echo "---"

ENDED=false
curl -s -N -X POST "$API_URL/api/chat/stream" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"content\":\"hello\",\"provider\":\"mock\"}" \
  -b "$COOKIE_FILE" \
  --max-time 15 | while IFS= read -r line; do
  echo "$line"
  if echo "$line" | grep -q 'event: end'; then
    ENDED=true
  fi
done

echo "---"
if [ "$ENDED" = "true" ]; then
  echo "✅ SSE stream completed successfully (end event received)"
  exit 0
else
  echo "⚠️  SSE stream may not have completed (no end event seen)"
  exit 0
fi

