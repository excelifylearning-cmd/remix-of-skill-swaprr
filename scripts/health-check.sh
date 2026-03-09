#!/bin/bash
# Quick health check for deployed SkillSwappr instance
URL="${1:-https://skillswappr.lovable.app}"

echo "🏥 Health check: $URL"

# Check frontend
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Frontend: OK ($HTTP_CODE)"
else
  echo "❌ Frontend: FAIL ($HTTP_CODE)"
  exit 1
fi

# Check Supabase API
API_URL="${VITE_SUPABASE_URL:-}"
if [ -n "$API_URL" ]; then
  API_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/rest/v1/" \
    -H "apikey: ${VITE_SUPABASE_PUBLISHABLE_KEY:-}")
  if [ "$API_CODE" = "200" ]; then
    echo "✅ Backend API: OK ($API_CODE)"
  else
    echo "⚠️  Backend API: $API_CODE"
  fi
fi

echo "🏥 Health check complete"
