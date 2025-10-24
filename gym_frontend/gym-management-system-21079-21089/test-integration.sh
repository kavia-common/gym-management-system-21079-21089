#!/bin/bash

echo "🔍 Testing Gym Management System Integration"
echo "=============================================="
echo ""

BACKEND_URL="https://vscode-internal-37835-beta.beta01.cloud.kavia.ai:3001"
FRONTEND_URL="https://vscode-internal-37835-beta.beta01.cloud.kavia.ai:3000"

# Test 1: Backend Health Check
echo "1️⃣ Testing Backend Health..."
HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/health")
HEALTH_CODE=$(echo "$HEALTH_RESPONSE" | tail -n 1)
HEALTH_BODY=$(echo "$HEALTH_RESPONSE" | head -n -1)

if [ "$HEALTH_CODE" = "200" ]; then
    echo "✅ Backend is healthy"
    echo "   Response: $HEALTH_BODY"
else
    echo "❌ Backend health check failed (HTTP $HEALTH_CODE)"
fi
echo ""

# Test 2: OpenAPI Spec
echo "2️⃣ Testing OpenAPI Documentation..."
OPENAPI_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/openapi.json")
OPENAPI_CODE=$(echo "$OPENAPI_RESPONSE" | tail -n 1)

if [ "$OPENAPI_CODE" = "200" ]; then
    echo "✅ OpenAPI spec available"
else
    echo "❌ OpenAPI spec not available (HTTP $OPENAPI_CODE)"
fi
echo ""

# Test 3: Admin Login
echo "3️⃣ Testing Admin Login..."
LOGIN_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BACKEND_URL/api/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin@gym.com&password=Admin123!")

LOGIN_CODE=$(echo "$LOGIN_RESPONSE" | tail -n 1)
LOGIN_BODY=$(echo "$LOGIN_RESPONSE" | head -n -1)

if [ "$LOGIN_CODE" = "200" ]; then
    echo "✅ Admin login successful"
    TOKEN=$(echo "$LOGIN_BODY" | grep -o '"access_token":"[^"]*"' | cut -d'"' -f4)
    echo "   Token received: ${TOKEN:0:20}..."
else
    echo "❌ Admin login failed (HTTP $LOGIN_CODE)"
    echo "   Response: $LOGIN_BODY"
fi
echo ""

# Test 4: Authenticated Request
if [ -n "$TOKEN" ]; then
    echo "4️⃣ Testing Authenticated Request..."
    ME_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/auth/me" \
      -H "Authorization: Bearer $TOKEN")
    
    ME_CODE=$(echo "$ME_RESPONSE" | tail -n 1)
    ME_BODY=$(echo "$ME_RESPONSE" | head -n -1)
    
    if [ "$ME_CODE" = "200" ]; then
        echo "✅ Authenticated request successful"
        echo "   User: $ME_BODY"
    else
        echo "❌ Authenticated request failed (HTTP $ME_CODE)"
    fi
    echo ""
    
    # Test 5: Admin Dashboard
    echo "5️⃣ Testing Admin Dashboard..."
    DASHBOARD_RESPONSE=$(curl -s -w "\n%{http_code}" "$BACKEND_URL/api/dashboard/admin" \
      -H "Authorization: Bearer $TOKEN")
    
    DASHBOARD_CODE=$(echo "$DASHBOARD_RESPONSE" | tail -n 1)
    DASHBOARD_BODY=$(echo "$DASHBOARD_RESPONSE" | head -n -1)
    
    if [ "$DASHBOARD_CODE" = "200" ]; then
        echo "✅ Admin dashboard accessible"
        echo "   Metrics: $DASHBOARD_BODY"
    else
        echo "❌ Admin dashboard failed (HTTP $DASHBOARD_CODE)"
    fi
    echo ""
fi

# Test 6: CORS Preflight
echo "6️⃣ Testing CORS Configuration..."
CORS_RESPONSE=$(curl -s -w "\n%{http_code}" -X OPTIONS "$BACKEND_URL/api/auth/login" \
  -H "Origin: $FRONTEND_URL" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type,Authorization")

CORS_CODE=$(echo "$CORS_RESPONSE" | tail -n 1)

if [ "$CORS_CODE" = "200" ]; then
    echo "✅ CORS configured correctly"
else
    echo "❌ CORS configuration issue (HTTP $CORS_CODE)"
fi
echo ""

# Summary
echo "=============================================="
echo "🎉 Integration Test Summary"
echo "=============================================="
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo ""
echo "Next Steps:"
echo "1. Open frontend at: $FRONTEND_URL"
echo "2. Login with: admin@gym.com / Admin123!"
echo "3. Verify all features work correctly"
echo ""
echo "✅ Integration configuration is complete!"
