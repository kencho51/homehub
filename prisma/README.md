# Prisma Directory

This directory contains database-related files for the Family Hub application.

## Files

### `schema.prisma`

Prisma schema definition containing all database models (User, CalendarEvent, TravelPlan, NewsEntry).

### `dev.db`

**Not used with D1 local development.**

This SQLite database file is only used as a fallback when running the application without the Wrangler proxy. When using D1 (recommended), the database is stored in `.wrangler/state/v3/d1/` instead.

To use D1: `npm run dev:d1`

### `migrations/schema.sql`

SQL schema file used to initialize the D1 database structure. This is executed when running `npm run db:push`.

### `seed.sql`

SQL seed data file containing test users and sample data. This is executed when running `npm run db:seed`.

Test credentials in seed data:

- Admin: admin@family-hub.com / admin123
- User 1: john@family-hub.com / test123
- User 2: jane@family-hub.com / test123

## D1 Database Location

When using Cloudflare D1 locally, your database files are stored in:

```
.wrangler/state/v3/d1/miniflare-D1DatabaseObject/
```

This directory is automatically created by Wrangler and should not be committed to git (it's in .gitignore).

## Usage

```bash
# Generate Prisma client
npm run db:generate

# Initialize D1 database schema
npm run db:push

# Seed D1 database with test data
npm run db:seed

# Reset everything
npm run db:reset

# Verify connection
npm run tsx scripts/verify-d1-connection.ts
```

For more details, see `D1_CONNECTION_GUIDE.md` in the project root.
