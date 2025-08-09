#!/bin/bash

echo "=== Kid Bridge Expenses API Test ==="
echo ""

BASE_URL="http://localhost:3001"

echo "1. Testing basic health check..."
curl -X GET $BASE_URL || echo "Failed to connect"
echo ""
echo ""

echo "2. Testing user login to get token..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@kidbridge.com",
    "password": "password123"
  }')

echo $LOGIN_RESPONSE
echo ""

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$TOKEN" ]; then
  echo "3. Getting children to use for expense tests..."
  CHILDREN_RESPONSE=$(curl -s -X GET $BASE_URL/children \
    -H "Authorization: Bearer $TOKEN")
  echo $CHILDREN_RESPONSE
  echo ""
  
  # Extract first child ID (basic approach)
  CHILD_ID=$(echo $CHILDREN_RESPONSE | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
  
  if [ ! -z "$CHILD_ID" ]; then
    echo "4. Testing expense creation..."
    EXPENSE_RESPONSE=$(curl -s -X POST $BASE_URL/expenses \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "{
        \"title\": \"Test Expense\",
        \"description\": \"Test expense for API testing\",
        \"amount\": 150.50,
        \"category\": \"EDUCATION\",
        \"expenseDate\": \"2025-08-03\",
        \"childId\": \"$CHILD_ID\"
      }")
    echo $EXPENSE_RESPONSE
    echo ""

    # Extract expense ID
    EXPENSE_ID=$(echo $EXPENSE_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)

    echo "5. Testing get all expenses..."
    curl -s -X GET $BASE_URL/expenses \
      -H "Authorization: Bearer $TOKEN"
    echo ""
    echo ""

    echo "6. Testing expense stats..."
    curl -s -X GET $BASE_URL/expenses/stats \
      -H "Authorization: Bearer $TOKEN"
    echo ""
    echo ""

    if [ ! -z "$EXPENSE_ID" ]; then
      echo "7. Testing get specific expense..."
      curl -s -X GET $BASE_URL/expenses/$EXPENSE_ID \
        -H "Authorization: Bearer $TOKEN"
      echo ""
      echo ""

      echo "8. Testing expense update..."
      curl -s -X PATCH $BASE_URL/expenses/$EXPENSE_ID \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $TOKEN" \
        -d '{
          "title": "Updated Test Expense",
          "amount": 200.00
        }'
      echo ""
      echo ""

      echo "9. Testing expense deletion..."
      curl -s -X DELETE $BASE_URL/expenses/$EXPENSE_ID \
        -H "Authorization: Bearer $TOKEN"
      echo ""
      echo ""
    fi
  else
    echo "No children found, skipping expense tests"
  fi
else
  echo "Could not extract token, skipping expenses tests"
fi

echo ""
echo "=== Expenses Test Complete ==="