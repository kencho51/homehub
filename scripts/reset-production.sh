#!/bin/bash
# Production D1 Database Reset Script
# 
# This script will:
# 1. Backup current production data
# 2. Drop all tables
# 3. Recreate schema
# 4. Seed with production data from seed-live.sql
#
# ⚠️  WARNING: This will DELETE ALL production data! ⚠️

set -e  # Exit on any error

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║         PRODUCTION D1 DATABASE RESET                           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "⚠️  WARNING: This will DELETE ALL production data!"
echo ""
echo "This will:"
echo "  1. Backup current production data"
echo "  2. Drop all tables (DELETE ALL DATA)"
echo "  3. Recreate database schema"
echo "  4. Seed with production data (ken, judy)"
echo ""
read -p "Are you absolutely sure? Type 'yes' to continue: " confirm

if [ "$confirm" != "yes" ]; then
  echo ""
  echo "❌ Cancelled. No changes were made."
  echo ""
  exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 1: Creating backup..."
echo "════════════════════════════════════════════════════════════════"

BACKUP_FILE="backup-$(date +%Y%m%d-%H%M%S).sql"
wrangler d1 export homehub-db --remote --output="$BACKUP_FILE"

if [ -f "$BACKUP_FILE" ]; then
  BACKUP_SIZE=$(ls -lh "$BACKUP_FILE" | awk '{print $5}')
  echo "✅ Backup created: $BACKUP_FILE ($BACKUP_SIZE)"
else
  echo "❌ Failed to create backup!"
  exit 1
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 2: Checking seed-live.sql..."
echo "════════════════════════════════════════════════════════════════"

if [ ! -f "prisma/seed-live.sql" ]; then
  echo "❌ Error: prisma/seed-live.sql not found!"
  echo "   Please create seed-live.sql with your production users."
  exit 1
fi

echo "✅ Found seed-live.sql"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 3: Dropping all tables..."
echo "════════════════════════════════════════════════════════════════"

wrangler d1 execute homehub-db --remote --command="
DROP TABLE IF EXISTS NewsEntry;
DROP TABLE IF EXISTS TravelPlan;
DROP TABLE IF EXISTS CalendarEvent;
DROP TABLE IF EXISTS User;
"

echo "✅ All tables dropped"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 4: Recreating schema..."
echo "════════════════════════════════════════════════════════════════"

wrangler d1 execute homehub-db --remote --file=./prisma/migrations/schema.sql

echo "✅ Schema recreated"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 5: Seeding production data..."
echo "════════════════════════════════════════════════════════════════"

wrangler d1 execute homehub-db --remote --file=./prisma/seed-live.sql

echo "✅ Production data seeded"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Step 6: Verifying database..."
echo "════════════════════════════════════════════════════════════════"

echo ""
echo "Users in database:"
wrangler d1 execute homehub-db --remote --command="SELECT name, email, role FROM User;"

echo ""
echo "Record counts:"
wrangler d1 execute homehub-db --remote --command="
SELECT 'Users' as type, COUNT(*) as count FROM User
UNION ALL
SELECT 'Events', COUNT(*) FROM CalendarEvent
UNION ALL
SELECT 'Travel', COUNT(*) FROM TravelPlan
UNION ALL
SELECT 'News', COUNT(*) FROM NewsEntry;
"

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║              ✨ RESET COMPLETE! ✨                             ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "✅ Production database has been reset and seeded"
echo "📦 Backup saved to: $BACKUP_FILE"
echo ""
echo "🔐 Production Login Credentials:"
echo "   Username: ken  | Password: Football36"
echo "   Username: judy | Password: Greenday27"
echo ""
echo "🌐 Test at your production URL"
echo ""

