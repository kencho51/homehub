# Family Hub

A modern, full-stack family management application built with Nuxt 4, Vue 3, and SQLite. Keep your family organized with shared calendars, travel planning, and news updates.

## 🌟 Features

- **🔐 Authentication System**: Secure user registration and login with JWT tokens and bcrypt password hashing
- **📅 Family Calendar**: Create, view, and manage family events with day/week/month grid views
- **✈️ Travel Planner**: Plan trips with detailed itineraries, budgets, and export to calendar
- **📰 Family News**: Post and view family updates and announcements
- **👥 User Profiles**: View activity stats and manage account settings
- **🎨 Modern UI**: Beautiful interface using shadcn/ui components with Tailwind CSS
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Nuxt 4 (Vue 3)
- **UI Components**: shadcn-vue with Radix Vue
- **Styling**: Tailwind CSS
- **Database**: SQLite (via Prisma)
- **ORM**: Prisma
- **Authentication**: JWT (jose) + bcrypt
- **Validation**: Zod
- **Deployment**: Cloudflare Pages (optional)

## 📋 Prerequisites

- Node.js 18+ and npm

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file:

```bash
cp env.example .env
```

Edit `.env` and set:

```env
JWT_SECRET=your-secure-random-secret-key-here
DATABASE_URL="file:./prisma/dev.db"
```

### 3. Set Up Database

Generate Prisma client and initialize database:

```bash
npm run db:generate
npm run db:reset
```

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

**Note:** Local development uses SQLite (`prisma/dev.db`). Simple and fast! See [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md) for details.

**Test Credentials:**

- **Admin**: admin / admin123
- **User 1**: john / test123
- **User 2**: jane / test123

## 📁 Project Structure

```
family-hub/
├── assets/           # CSS and static assets
├── components/       # Vue components
│   ├── CalendarGrid.vue  # Calendar grid with day/week/month views
│   └── ui/          # shadcn-vue UI components
├── composables/      # Vue composables
│   ├── useAuth.ts   # Authentication logic
│   └── useApi.ts    # API helper
├── layouts/          # Nuxt layouts
│   └── default.vue  # Main layout with navigation
├── lib/              # Utility functions
│   ├── auth.ts      # Auth helpers (JWT, bcrypt)
│   ├── db.ts        # Prisma client setup
│   ├── utils.ts     # UI utilities
│   └── validation.ts # Zod schemas
├── middleware/       # Route middleware
│   └── auth.ts      # Authentication middleware
├── pages/            # Application pages
│   ├── index.vue    # Dashboard with calendar and news tabs
│   ├── login.vue    # Login page
│   ├── register.vue # Registration page
│   ├── profile.vue  # User profile
│   ├── travel.vue   # Travel planner
│   └── news.vue     # Family news
├── prisma/           # Prisma schema and migrations
│   ├── schema.prisma
│   ├── dev.db       # SQLite database
│   ├── seed-dev.sql # Development seed data
│   └── seed-live.sql# Production seed data (not in git)
├── scripts/          # Utility scripts
│   ├── seed.ts      # Database seeding
│   └── generate-hashes.ts  # Password hash generator
├── server/           # Server-side code
│   └── api/         # API endpoints
│       ├── auth/    # Authentication endpoints
│       ├── calendar/# Calendar CRUD
│       ├── travel/  # Travel CRUD
│       └── news/    # News CRUD
├── .env.example      # Environment variables template
├── nuxt.config.ts    # Nuxt configuration
├── package.json      # Dependencies and scripts
└── tailwind.config.js# Tailwind configuration
```

## 🔑 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Calendar Events

- `GET /api/calendar` - List all events
- `POST /api/calendar` - Create event
- `GET /api/calendar/:id` - Get event details
- `PUT /api/calendar/:id` - Update event
- `DELETE /api/calendar/:id` - Delete event

### Travel Plans

- `GET /api/travel` - List all travel plans
- `POST /api/travel` - Create travel plan
- `GET /api/travel/:id` - Get travel plan details
- `PUT /api/travel/:id` - Update travel plan
- `DELETE /api/travel/:id` - Delete travel plan

### News Entries

- `GET /api/news` - List news entries
- `POST /api/news` - Create news entry
- `GET /api/news/:id` - Get news entry details
- `PUT /api/news/:id` - Update news entry
- `DELETE /api/news/:id` - Delete news entry

All protected endpoints require `Authorization: Bearer <token>` header.

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Database (Local Development)
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:seed          # Seed database with test data
npm run db:reset         # Reset database (delete + push + seed)

# Advanced: D1 Local Testing (Optional)
npm run dev:d1           # Start with D1 database locally
npm run db:push:d1       # Push schema to D1 local database
npm run db:seed:d1       # Seed D1 local database
npm run db:reset:d1      # Reset D1 local database

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier

# Deployment
npm run deploy           # Build and deploy to Cloudflare Pages
```

## 🎯 Key Features Explained

### Calendar Grid Views

The calendar component supports three view modes:

- **Month View**: Traditional calendar showing events on their dates
- **Week View**: 7-day grid with hourly slots
- **Day View**: 24-hour timeline for detailed scheduling

Multi-day events appear as color bars spanning their duration.

### Travel Planner

- Create detailed travel plans with destinations, budgets, and itineraries
- View plans in both card view and calendar grid
- Export travel plans to the family calendar
- Grid view shows travel duration as colored bars

### Quick Edit

Click any event in the calendar grid to quickly edit description and times without opening the full form.

## 🧪 Testing Credentials

After running `npm run db:seed`:

| Username | Password | Role   |
| -------- | -------- | ------ |
| admin    | admin123 | admin  |
| john     | test123  | member |
| jane     | test123  | member |

**⚠️ Important**: Change these credentials before deploying to production!

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 7-day token expiration
- **Input Validation**: Zod schemas for all API endpoints
- **Authorization**: Role-based access control
- **CSRF Protection**: Built into Nuxt
- **Secure Cookies**: HTTP-only cookies for auth tokens

## 🐛 Troubleshooting

### Database Issues

If you're seeing old data or login doesn't work:

```bash
# Reset local database
npm run db:reset
```

### Authentication Not Working

- Verify `JWT_SECRET` is set in `.env`
- Check browser cookies are enabled
- Clear browser cache and cookies

### Build Errors

```bash
# Clear Nuxt cache
rm -rf .nuxt .output

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🌐 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for Cloudflare Pages and other platforms.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

Built with ❤️ for families everywhere.
