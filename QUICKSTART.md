# Quick Start Guide

Get Family Hub running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm installed
- Terminal/command line access

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Database
```bash
# Generate Prisma client
npm run db:generate

# Create database tables
npx prisma db push

# Seed with test data
npm run db:seed
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Open in Browser
Visit: http://localhost:3000

## Test Credentials

Use these credentials to log in:

**Admin Account:**
- Email: `admin@family-hub.com`
- Password: `admin123`

**Regular User:**
- Email: `john@family-hub.com`
- Password: `test123`

## What to Try First

1. **Log in** with admin credentials
2. **Create a calendar event** - Click Calendar → Add Event
3. **Plan a trip** - Click Travel → Add Travel Plan
4. **Post news** - Click News → Post News
5. **Register a new user** - Log out and click Register

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Format code
npm run format

# Reseed database
npm run db:seed
```

## Project Structure

```
family-hub/
├── pages/          # Application pages (auto-routed)
├── components/     # Reusable Vue components
├── server/api/     # Backend API endpoints
├── lib/            # Utilities and helpers
├── prisma/         # Database schema
└── assets/         # Styles and static files
```

## Need Help?

- Full documentation: See `README.md`
- API reference: See `API.md`
- Deployment: See `DEPLOYMENT.md`

## Next Steps

1. **Customize** the application for your needs
2. **Deploy** to Cloudflare Pages (see DEPLOYMENT.md)
3. **Extend** with new features

## Troubleshooting

### Database Issues
```bash
# Reset database
rm dev.db
npx prisma db push
npm run db:seed
```

### Module Errors
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Port Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

## Security Note

⚠️ The seeded credentials are for development only. Change them before deploying to production!

---

Happy coding! 🎉

