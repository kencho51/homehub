import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

/**
 * Seed script for SQLite/Prisma development
 *
 * Creates test users with consistent credentials:
 * - admin@family-hub.com / admin123 (Admin User)
 * - john@family-hub.com / test123 (John Doe)
 * - jane@family-hub.com / test123 (Jane Smith)
 *
 * For D1 database, use: npm run db:seed (runs prisma/seed.sql)
 * For SQLite file, use: npm run tsx scripts/seed.ts
 *
 * Both approaches create the SAME test users with SAME credentials.
 */

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Hash passwords (matches credentials in prisma/seed.sql)
  const adminPassword = await bcrypt.hash('admin123', 10)
  const testPassword = await bcrypt.hash('test123', 10)

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@family-hub.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@family-hub.com',
      password: adminPassword,
      role: 'admin',
    },
  })
  console.log('✓ Created admin user:', admin.email)

  // Create test users
  const testUser1 = await prisma.user.upsert({
    where: { email: 'john@family-hub.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@family-hub.com',
      password: testPassword,
      role: 'member',
    },
  })
  console.log('✓ Created test user:', testUser1.email)

  const testUser2 = await prisma.user.upsert({
    where: { email: 'jane@family-hub.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@family-hub.com',
      password: testPassword,
      role: 'member',
    },
  })
  console.log('✓ Created test user:', testUser2.email)

  // Create sample calendar events
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const nextWeek = new Date(today)
  nextWeek.setDate(nextWeek.getDate() + 7)

  await prisma.calendarEvent.create({
    data: {
      title: 'Family Dinner',
      description: 'Weekly family dinner at home',
      startDate: tomorrow,
      endDate: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // 2 hours later
      location: 'Home',
      allDay: false,
      createdBy: admin.id,
    },
  })
  console.log('✓ Created sample calendar event')

  // Create sample travel plan
  const travelStart = new Date(today)
  travelStart.setDate(travelStart.getDate() + 30)
  const travelEnd = new Date(travelStart)
  travelEnd.setDate(travelEnd.getDate() + 7)

  await prisma.travelPlan.create({
    data: {
      title: 'Summer Vacation',
      destination: 'Beach Resort',
      description: 'Annual family summer vacation',
      startDate: travelStart,
      endDate: travelEnd,
      itinerary: JSON.stringify([
        { day: 1, activity: 'Arrival and check-in' },
        { day: 2, activity: 'Beach day' },
        { day: 3, activity: 'City tour' },
      ]),
      budget: 5000,
      createdBy: testUser1.id,
    },
  })
  console.log('✓ Created sample travel plan')

  // Create sample news entries
  await prisma.newsEntry.create({
    data: {
      title: 'Welcome to Family Hub!',
      content:
        'We are excited to launch our new family hub application. Stay connected with calendar events, travel plans, and family news all in one place!',
      createdBy: admin.id,
    },
  })
  console.log('✓ Created sample news entry')

  console.log('✨ Seeding completed successfully!')
  console.log('\n📝 Test Credentials:')
  console.log('Admin: admin@family-hub.com / admin123')
  console.log('User 1: john@family-hub.com / test123')
  console.log('User 2: jane@family-hub.com / test123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
