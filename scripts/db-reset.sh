#!/bin/bash
set -euo pipefail

# Reset local Supabase database and re-run all migrations
echo "🗄️  Resetting database..."
supabase db reset
echo "🌱 Seeding test data..."
supabase functions serve seed-test-data &
sleep 3
curl -X POST http://localhost:54321/functions/v1/seed-test-data \
  -H "Authorization: Bearer $(supabase status | grep 'anon key' | awk '{print $NF}')" \
  -H "Content-Type: application/json"
echo "✅ Database reset complete!"
