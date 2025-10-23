# Family Hub - Project Summary

## Overview

Family Hub is a modern web application for families to coordinate and share information. Built with Nuxt 4 and Vue 3, it provides a centralized place for calendar events, travel planning, and family news.

## Core Features

### 1. Dashboard

- **Family Calendar Tab**: Unified view of all calendar events
- **Family News Tab**: Latest family updates and announcements
- Day/Week/Month grid views with visual duration bars
- Quick-edit functionality for events

### 2. Travel Planner

- Create travel plans with destinations, budgets, and itineraries
- Calendar grid and card views
- Export travel plans to family calendar
- Detailed trip planning with dates and budget tracking

### 3. Family News

- Post and share family updates
- Rich text content support
- Timestamped entries with creator attribution

### 4. User Management

- Secure authentication with JWT
- User profiles with activity statistics
- Role-based access control (admin/member)

## Technical Architecture

### Frontend

- **Framework**: Nuxt 4 with Vue 3 Composition API
- **UI**: shadcn-vue components (Radix Vue + Tailwind CSS)
- **State Management**: Vue Composables (useAuth, useApi)
- **Routing**: Nuxt file-based routing with middleware protection

### Backend

- **Runtime**: Nuxt Server (Nitro)
- **Database**: SQLite via Prisma ORM
- **Authentication**: JWT tokens + bcrypt password hashing
- **API**: RESTful endpoints with Zod validation

### Components

#### CalendarGrid.vue

Sophisticated calendar component with three view modes:

- **Month View**: Traditional calendar grid showing events on dates
- **Week View**: 7-day grid with hourly slots and duration bars
- **Day View**: 24-hour timeline with duration bars at top

Features:

- Multi-day event visualization as colored bars
- Quick-edit modals for events
- Click empty slots to create new events
- Hover-to-delete functionality

#### UI Components

- Button (with variants: default, outline, destructive, ghost)
- Card (with Header, Title, Description, Content)
- Input (text, datetime-local, number)
- Label
- Textarea

### Data Models

#### User

- id, email, password (hashed), name, role
- Relations: CalendarEvents, TravelPlans, NewsEntries

#### CalendarEvent

- id, title, description, location, startDate, endDate, allDay
- Creator relation

#### TravelPlan

- id, title, destination, description, startDate, endDate, budget, itinerary
- Creator relation

#### NewsEntry

- id, title, content
- Creator relation

## User Workflows

### Creating an Event

1. Navigate to Dashboard > Family Calendar tab
2. Click "Add Event" or click on an empty time slot
3. Fill in event details
4. Save to calendar

### Planning a Trip

1. Go to Travel Planner
2. Click "Add Travel Plan"
3. Enter destination, dates, budget, itinerary
4. View in grid or card view
5. Optionally export to Family Calendar

### Sharing News

1. Navigate to Dashboard > Family News tab
2. Click "Post News"
3. Enter title and content
4. Post to family feed

## File Structure

```
/
├── pages/              # Application routes
│   ├── index.vue       # Dashboard (calendar + news)
│   ├── travel.vue      # Travel planner
│   ├── news.vue        # News management
│   ├── profile.vue     # User profile
│   ├── login.vue       # Authentication
│   └── register.vue    # User registration
├── components/
│   ├── CalendarGrid.vue # Calendar grid component
│   └── ui/             # shadcn-vue components
├── server/api/         # API endpoints
│   ├── auth/           # Authentication
│   ├── calendar/       # Calendar CRUD
│   ├── travel/         # Travel CRUD
│   └── news/           # News CRUD
├── composables/        # Vue composables
├── layouts/           # Page layouts
├── lib/               # Utilities
├── middleware/        # Route guards
├── prisma/            # Database schema & migrations
└── scripts/           # Utility scripts
```

## Development Setup

### Prerequisites

- Node.js 18+
- npm

### Quick Start

```bash
npm install
cp env.example .env
npm run db:generate
npm run db:push
npm run db:seed
npm run dev
```

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:reset` - Reset database
- `npm run lint` - Run linter
- `npm run format` - Format code

## Security

- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Password Security**: bcrypt with 10 rounds
- **Authorization**: Middleware-protected routes
- **Validation**: Zod schemas for all inputs
- **CSRF**: Built-in Nuxt protection

## Testing Credentials

| Email                | Password | Role   |
| -------------------- | -------- | ------ |
| admin@family-hub.com | admin123 | admin  |
| john@family-hub.com  | test123  | member |
| jane@family-hub.com  | test123  | member |

## Deployment

Application is designed for deployment on:

- Cloudflare Pages (primary target)
- Vercel
- Netlify
- Any Node.js hosting platform

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Future Enhancements

Potential features for future development:

- Real-time notifications
- File attachments for travel plans
- Recurring calendar events
- Calendar event reminders
- Family photo albums
- Shopping lists
- Task management
- Mobile app (React Native)

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## Documentation

- [README.md](./README.md) - Main documentation
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup guide
- [API.md](./API.md) - API endpoint reference
- [FEATURES.md](./FEATURES.md) - Feature documentation
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions

---

Last Updated: 2024
Version: 1.0.0
