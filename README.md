# Family Hub

A modern, full-stack family management application built with Nuxt 4, Vue 3, and Cloudflare technologies. Keep your family organized with shared calendars, travel planning, and news updates.

## 🌟 Features

- **🔐 Authentication System**: Secure user registration and login with JWT tokens and bcrypt password hashing
- **📅 Family Calendar**: Create, view, and manage family events with day/week/month views
- **✈️ Travel Planner**: Plan trips with detailed itineraries, budgets, and shared visibility
- **📰 Family News**: Post and view family updates and announcements
- **👥 User Roles**: Admin and member roles with appropriate permissions
- **🎨 Modern UI**: Beautiful interface using shadcn/ui components with Tailwind CSS
- **☁️ Cloud-Ready**: Designed for deployment on Cloudflare Pages with D1 database

## 🛠️ Tech Stack

- **Frontend**: Nuxt 4 (Vue 3)
- **UI Components**: shadcn-vue with Radix Vue
- **Styling**: Tailwind CSS
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Prisma with D1 adapter
- **Authentication**: JWT (jose) + bcrypt
- **Validation**: Zod
- **Deployment**: Cloudflare Pages + Workers
- **Development**: Wrangler CLI

## 📋 Prerequisites

- Node.js 18+ and npm
- Cloudflare account (for deployment)
- Wrangler CLI installed (`npm install -g wrangler`)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

Edit `.env` and set:
```env
JWT_SECRET=your-secure-random-secret-key-here
DATABASE_URL="file:./dev.db"
```

### 3. Set Up Database

Generate Prisma client:
```bash
npm run db:generate
```

For local development, push the schema to a local SQLite database:
```bash
npx prisma db push
```

### 4. Seed the Database

Create initial admin and test users:
```bash
npm run db:seed
```

This creates:
- **Admin**: admin@family-hub.com / admin123
- **User 1**: john@family-hub.com / test123
- **User 2**: jane@family-hub.com / test123

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000 and log in with one of the seeded accounts.

## 🌐 Cloudflare Deployment

### Set Up Cloudflare D1 Database

1. **Create a D1 Database**:
   ```bash
   wrangler d1 create family-hub-db
   ```

2. **Copy `wrangler.toml.example` to `wrangler.toml`** and update with your database ID:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "family-hub-db"
   database_id = "your-actual-database-id"
   ```

3. **Execute migrations on D1**:
   ```bash
   wrangler d1 execute family-hub-db --remote --file=./prisma/migrations/schema.sql
   ```

4. **Set JWT secret** (for production):
   ```bash
   wrangler pages secret put JWT_SECRET
   ```
   Enter a secure random string when prompted.

### Deploy to Cloudflare Pages

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy**:
   ```bash
   npm run deploy
   ```

   Or deploy via Cloudflare Dashboard:
   - Connect your Git repository to Cloudflare Pages
   - Set build command: `npm run build`
   - Set build output directory: `.output/public`
   - Add environment variable: `JWT_SECRET`
   - Add D1 database binding: `DB` → `family-hub-db`

## 📁 Project Structure

```
family-hub/
├── assets/           # CSS and static assets
│   └── css/
├── components/       # Vue components
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
│   ├── index.vue    # Dashboard
│   ├── login.vue    # Login page
│   ├── register.vue # Registration page
│   ├── calendar.vue # Calendar management
│   ├── travel.vue   # Travel planner
│   └── news.vue     # Family news
├── prisma/           # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── scripts/          # Utility scripts
│   └── seed.ts      # Database seeding
├── server/           # Server-side code
│   └── api/         # API endpoints
│       ├── auth/    # Authentication endpoints
│       ├── calendar/# Calendar CRUD
│       ├── travel/  # Travel CRUD
│       └── news/    # News CRUD
├── .env.example      # Environment variables template
├── nuxt.config.ts    # Nuxt configuration
├── package.json      # Dependencies and scripts
├── tailwind.config.js# Tailwind configuration
├── tsconfig.json     # TypeScript configuration
└── wrangler.toml.example # Wrangler config template
```

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Calendar Events
- `GET /api/calendar` - List all events (with date filtering)
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

## 🔒 Security Features

- **Password Hashing**: bcrypt with 10 salt rounds
- **JWT Authentication**: 7-day token expiration
- **Input Validation**: Zod schemas for all API endpoints
- **Authorization**: Role-based access control (admin/member)
- **CSRF Protection**: Built into Nuxt
- **Secure Headers**: Configured for Cloudflare Pages

## 🎨 UI Components

The application uses shadcn-vue components based on Radix Vue:
- Button
- Card (Card, CardHeader, CardTitle, CardDescription, CardContent)
- Input
- Label

Components follow the shadcn/ui design system with full Tailwind CSS customization.

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to local D1 (for development)
npm run db:seed          # Seed database with test data

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors
npm run format           # Format code with Prettier

# Deployment
npm run deploy           # Build and deploy to Cloudflare Pages
```

## 🧪 Testing Credentials

After running `npm run db:seed`, use these credentials:

| Email | Password | Role |
|-------|----------|------|
| admin@family-hub.com | admin123 | admin |
| john@family-hub.com | test123 | member |
| jane@family-hub.com | test123 | member |

**⚠️ Important**: Change these credentials before deploying to production!

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `DATABASE_URL` | Database connection string | Yes (dev only) |
| `NUXT_PUBLIC_API_BASE` | API base URL | No (defaults to `/api`) |

### Cloudflare Bindings

- **D1 Database**: Binding name `DB` must match your D1 database
- Set in `wrangler.toml` for local development
- Configure in Cloudflare Pages settings for production

## 🐛 Troubleshooting

### Database Connection Issues
- Ensure Prisma client is generated: `npm run db:generate`
- For local dev, verify `DATABASE_URL` in `.env`
- For production, check D1 binding in Cloudflare dashboard

### Authentication Not Working
- Verify `JWT_SECRET` is set in environment variables
- Check browser cookies are enabled
- Ensure Authorization header is sent with API requests

### Build Errors
- Clear `.nuxt` and `.output` directories
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version (18+ required)

## 📝 Development Notes

### Adding New Features
1. Create Prisma schema changes in `prisma/schema.prisma`
2. Generate SQL migration: `npx prisma migrate dev`
3. Create API endpoints in `server/api/`
4. Add validation schemas in `lib/validation.ts`
5. Create pages/components in `pages/` and `components/`

### Database Migrations
- For local development: `npx prisma db push`
- For production: Create SQL file and run with `wrangler d1 execute`

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For issues and questions, please open an issue on the GitHub repository.

---

Built with ❤️ for families everywhere.
