#!/usr/bin/env bash
# Re-link this repo to your kipkemoiadvocates@gmail.com Convex account.
# Run from project root after accepting the team invite OR logging in with your email.

set -euo pipefail
cd "$(dirname "$0")/.."

echo "=== Convex account relink ==="
echo ""
echo "This project was first created under another Convex login on this machine."
echo "To use kipkemoiadvocates@gmail.com as the owner, complete these steps:"
echo ""
echo "1. Open https://dashboard.convex.dev and sign in as kipkemoiadvocates@gmail.com"
echo "2. Check your email for a team invite and accept it"
echo "3. In the dashboard, switch to the team that owns csk-law-advocates"
echo "   Direct link: https://dashboard.convex.dev/t/crater-welfare/csk-law-advocates"
echo ""
read -r -p "Press Enter when you have accepted the invite and are signed in..."

echo ""
echo "Logging out the old Convex CLI session..."
npx convex logout || true

echo ""
echo "Logging in with kipkemoiadvocates@gmail.com (browser will open)..."
npx convex login --force

echo ""
echo "Teams available to this account:"
npx convex login status

echo ""
read -r -p "Enter your team slug (shown above, e.g. kipkemoi-advocates): " TEAM_SLUG

echo ""
echo "Linking project to team: $TEAM_SLUG"
npx convex dev --once --configure=existing --team "$TEAM_SLUG" --project csk-law-advocates

echo ""
echo "Setting blog admin password on dev deployment..."
read -r -s -p "Enter blog admin password for /blog/panel: " BLOG_SECRET
echo ""
npx convex env set BLOG_ADMIN_SECRET "$BLOG_SECRET"

echo ""
echo "Deploying to production..."
npx convex deploy --yes
npx convex env set BLOG_ADMIN_SECRET "$BLOG_SECRET" --prod

echo ""
echo "Updating .env.production with production Convex URL..."
PROD_URL=$(grep VITE_CONVEX_URL .env.local | cut -d= -f2 | sed 's/insightful-akita/veracious-setter/' || true)
if [ -z "$PROD_URL" ]; then
  echo "Run: npx convex deploy --yes"
  echo "Then copy VITE_CONVEX_URL from .env.local into .env.production"
else
  cat > .env.production <<EOF
VITE_CONVEX_URL=$PROD_URL
VITE_CONVEX_SITE_URL=${PROD_URL/.convex.cloud/.convex.site}
EOF
fi

echo ""
echo "Done. Run npm run build and upload dist/ to your host."
echo "Dashboard: https://dashboard.convex.dev/t/$TEAM_SLUG/csk-law-advocates"
