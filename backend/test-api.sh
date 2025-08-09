#!/bin/bash

echo "=== Kid Bridge Backend API Test ==="
echo ""

BASE_URL="http://localhost:3001"

echo "1. Testing basic health check..."
curl -X GET $BASE_URL || echo "Failed to connect"
echo ""
echo ""

echo "2. Testing user registration..."
curl -X POST $BASE_URL/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@kidbridge.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "Parent"
  }' || echo "Registration failed"
echo ""
echo ""

echo "3. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@kidbridge.com",
    "password": "password123"
  }')

echo $LOGIN_RESPONSE
echo ""

# Extract token from response (basic approach)
TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)

if [ ! -z "$TOKEN" ]; then
  echo "4. Testing protected profile endpoint..."
  curl -X GET $BASE_URL/auth/profile \
    -H "Authorization: Bearer $TOKEN" || echo "Profile test failed"
  echo ""
  echo ""

  echo "5. Testing children endpoint..."
  curl -X GET $BASE_URL/children \
    -H "Authorization: Bearer $TOKEN" || echo "Children test failed"
  echo ""
  echo ""

  echo "6. Testing child creation..."
  curl -X POST $BASE_URL/children \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "firstName": "Ahmet",
      "lastName": "Test",
      "dateOfBirth": "2015-05-15",
      "gender": "male"
    }' || echo "Child creation failed"
  echo ""
else
  echo "Could not extract token, skipping protected endpoint tests"
fi

echo ""
echo "=== Test Complete ==="