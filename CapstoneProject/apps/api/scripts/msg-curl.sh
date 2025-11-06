#!/bin/bash

# Message endpoint smoke test
# Tests: register → login → create session → send message (SSE or non-stream) → get messages (both routes)

API_URL="http://localhost:4000"
EMAIL="test-$(date +%s)@example.com"
PASSWORD="testing123"
COOKIE_FILE="/tmp/msg-curl-cookies.txt"

# Clean up old cookie file
rm -f "$COOKIE_FILE"

echo "=== Message Endpoint Diagnostic Test ==="
echo "API: $API_URL"
echo "Email: $EMAIL"
echo "Password: $PASSWORD"
echo ""

# Test 1: Register
echo "1. Registering new user..."
REGISTER_RESPONSE=$(curl -i -s -w "\n%{http_code}" -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -c "$COOKIE_FILE")

REGISTER_HTTP_CODE=$(echo "$REGISTER_RESPONSE" | tail -n1)
REGISTER_BODY=$(echo "$REGISTER_RESPONSE" | sed '$d')

if [ "$REGISTER_HTTP_CODE" != "201" ]; then
  echo "❌ Register failed! Status: $REGISTER_HTTP_CODE"
  echo "$REGISTER_BODY" | grep -A 5 "^{" | head -3
  exit 1
fi
echo "✅ Register successful (Status: $REGISTER_HTTP_CODE)"
echo ""

# Test 2: Login
echo "2. Logging in (capturing cookie)..."
LOGIN_RESPONSE=$(curl -i -s -w "\n%{http_code}" -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
  -c "$COOKIE_FILE" \
  -b "$COOKIE_FILE")

LOGIN_HTTP_CODE=$(echo "$LOGIN_RESPONSE" | tail -n1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | sed '$d')

if [ "$LOGIN_HTTP_CODE" != "200" ]; then
  echo "❌ Login failed! Status: $LOGIN_HTTP_CODE"
  echo "$LOGIN_BODY" | grep -A 5 "^{" | head -3
  exit 1
fi

# Check for cookie
if grep -q "token" "$COOKIE_FILE"; then
  echo "✅ Login successful (Status: $LOGIN_HTTP_CODE) - Cookie captured"
else
  echo "⚠️  Login successful but no cookie found in file"
fi
echo ""

# Test 3: Create session
echo "3. Creating session..."
SESSION_RESPONSE=$(curl -s -X POST "$API_URL/api/sessions" \
  -H "Content-Type: application/json" \
  -d "{}" \
  -b "$COOKIE_FILE")

SESSION_ID=$(echo "$SESSION_RESPONSE" | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$SESSION_ID" ]; then
  echo "❌ Failed to create session"
  echo "$SESSION_RESPONSE" | head -5
  exit 1
fi
echo "✅ Session created: $SESSION_ID"
echo ""

# Test 4: Try SSE streaming first
echo "4. Sending message via SSE (POST /api/chat/stream)..."
SSE_SUCCESS=false
SSE_OUTPUT=$(curl -s -N -X POST "$API_URL/api/chat/stream" \
  -H "Content-Type: application/json" \
  -H "Accept: text/event-stream" \
  -d "{\"sessionId\":\"$SESSION_ID\",\"content\":\"hi\"}" \
  -b "$COOKIE_FILE" \
  --max-time 10 2>&1)

SSE_STATUS=$(echo "$SSE_OUTPUT" | grep -o "HTTP/[0-9.]* [0-9]*" | tail -1 | awk '{print $2}')
if [ -n "$SSE_STATUS" ] && [ "$SSE_STATUS" != "200" ]; then
  echo "⚠️  SSE returned status $SSE_STATUS"
  echo "$SSE_OUTPUT" | head -10
else
  if echo "$SSE_OUTPUT" | grep -q "data:"; then
    echo "✅ SSE streaming works!"
    echo "Stream preview (first 3 data lines):"
    echo "$SSE_OUTPUT" | grep "^data:" | head -3 | sed 's/^data: //'
    SSE_SUCCESS=true
  else
    echo "⚠️  SSE not available or failed, trying non-stream..."
  fi
fi
echo ""

# Test 5: Send message (non-stream fallback)
if [ "$SSE_SUCCESS" != "true" ]; then
  echo "5. Sending message via non-stream (POST /api/chat)..."
  MESSAGE_RESPONSE=$(curl -i -s -w "\n%{http_code}" -X POST "$API_URL/api/chat" \
    -H "Content-Type: application/json" \
    -d "{\"sessionId\":\"$SESSION_ID\",\"content\":\"hi\",\"provider\":\"mock\"}" \
    -b "$COOKIE_FILE")

  MESSAGE_HTTP_CODE=$(echo "$MESSAGE_RESPONSE" | tail -n1)
  MESSAGE_BODY=$(echo "$MESSAGE_RESPONSE" | sed '$d')

  if [ "$MESSAGE_HTTP_CODE" != "200" ]; then
    echo "❌ Send message failed! Status: $MESSAGE_HTTP_CODE"
    echo "$MESSAGE_BODY" | grep -A 5 "^{" | head -3
    exit 1
  fi
  echo "✅ Message sent (Status: $MESSAGE_HTTP_CODE)"
  echo ""
fi

# Test 6: Get messages via /api/sessions/messages?sessionId=...
echo "6. Fetching messages via GET /api/sessions/messages?sessionId=$SESSION_ID"
MESSAGES_RESPONSE1=$(curl -i -s -w "\n%{http_code}" -X GET "$API_URL/api/sessions/messages?sessionId=$SESSION_ID" \
  -b "$COOKIE_FILE")

MESSAGES_HTTP_CODE1=$(echo "$MESSAGES_RESPONSE1" | tail -n1)
MESSAGES_BODY1=$(echo "$MESSAGES_RESPONSE1" | sed '$d')

echo "Status Code: $MESSAGES_HTTP_CODE1"
echo "Response Headers:"
echo "$MESSAGES_BODY1" | grep -i "content-type\|content-length" | head -2
echo "Response Body (first 200 chars):"
echo "$MESSAGES_BODY1" | grep -A 10 "^{" | head -5 | cut -c1-200
echo ""

if [ "$MESSAGES_HTTP_CODE1" = "200" ]; then
  echo "✅ Route 1 (/api/sessions/messages) works!"
  MESSAGE_COUNT=$(echo "$MESSAGES_BODY1" | grep -o '"_id"' | wc -l | tr -d ' ')
  echo "Messages found: $MESSAGE_COUNT"
else
  echo "❌ Route 1 failed!"
  echo "$MESSAGES_BODY1" | grep -A 5 "^{" | head -3
fi
echo ""

# Test 7: Check alternative route /api/sessions/:id/messages
echo "7. Checking alternative route GET /api/sessions/$SESSION_ID/messages"
MESSAGES_RESPONSE2=$(curl -i -s -w "\n%{http_code}" -X GET "$API_URL/api/sessions/$SESSION_ID/messages" \
  -b "$COOKIE_FILE" 2>&1)

MESSAGES_HTTP_CODE2=$(echo "$MESSAGES_RESPONSE2" | tail -n1)
MESSAGES_BODY2=$(echo "$MESSAGES_RESPONSE2" | sed '$d')

echo "Status Code: $MESSAGES_HTTP_CODE2"
if [ "$MESSAGES_HTTP_CODE2" = "200" ]; then
  echo "✅ Route 2 (/api/sessions/:id/messages) also works!"
  echo "$MESSAGES_BODY2" | grep -A 5 "^{" | head -3
elif [ "$MESSAGES_HTTP_CODE2" = "404" ]; then
  echo "ℹ️  Route 2 returns 404 (not implemented, expected)"
else
  echo "ℹ️  Route 2 status: $MESSAGES_HTTP_CODE2 (may not exist)"
fi
echo ""

# Summary
echo "=== Summary ==="
if [ "$MESSAGES_HTTP_CODE1" = "200" ]; then
  echo "✅ Primary route (/api/sessions/messages) works correctly"
  echo "✅ Messages can be fetched successfully"
  echo "✅ All tests passed!"
  exit 0
else
  echo "❌ Primary route failed with status $MESSAGES_HTTP_CODE1"
  echo "❌ Tests failed!"
  exit 1
fi

