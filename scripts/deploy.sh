#!/bin/bash
set -euo pipefail

# SkillSwappr Deployment Script
# Usage: ./scripts/deploy.sh [preview|production]

ENV="${1:-preview}"
echo "🚀 Deploying SkillSwappr ($ENV)..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm ci

# 2. Run checks
echo "🔍 Type checking..."
npx tsc --noEmit

echo "🧪 Running tests..."
npx vitest run

# 3. Build
echo "🏗️  Building for production..."
npm run build

# 4. Deploy
if [ "$ENV" = "production" ]; then
  echo "🌍 Deploying to production..."
  npx netlify deploy --prod --dir=dist
else
  echo "👀 Deploying preview..."
  npx netlify deploy --dir=dist
fi

echo "✅ Deployment complete!"
