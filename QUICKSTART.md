# 🚀 Family Hub - Quick Start Guide

Get your Family Hub up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm package manager

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

```bash
cp env.example .env
```

Edit `.env`:

```env
JWT_SECRET=your-super-secret-key-change-this-in-production
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Setup Database

```bash
# Generate Prisma client
npm run db:generate

# Initialize and seed database
npm run db:reset
```

### 4. Start Development Server

```bash
npm run dev
```

Open http://localhost:3000

### 5. Login

Use these test credentials:

- **Username**: `admin`
- **Password**: `admin123`

## 🎉 You're Ready!

Explore the features:

- **Dashboard**: View family calendar and news
- **Travel Planner**: Create and manage travel plans
- **News**: Post family updates
- **Profile**: View your activity and settings

## Common Commands

```bash
# Reset database
npm run db:reset

# Run linting
npm run lint

# Format code
npm run format
```

## Need Help?

- Local development guide: [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)
- Full documentation: [README.md](./README.md)
- API reference: [API.md](./API.md)
- Feature details: [FEATURES.md](./FEATURES.md)

## Next Steps

1. Change the default passwords in production
2. Generate a secure `JWT_SECRET`
3. Customize the UI to match your family's needs
4. Deploy to Cloudflare Pages (see [DEPLOYMENT.md](./DEPLOYMENT.md))

---

Happy organizing! 👨‍👩‍👧‍👦
