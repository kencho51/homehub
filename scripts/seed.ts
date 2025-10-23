import { PrismaClient } from '@prisma/client'
import { webcrypto } from 'node:crypto'

/**
 * Seed script for SQLite/Prisma development
 *
 * Creates test users with consistent credentials:
 * - admin / admin123 (Admin User)
 * - john / test123 (John Doe)
 * - jane / test123 (Jane Smith)
 *
 * Uses Web Crypto API (PBKDF2) for password hashing - compatible with Cloudflare Workers
 */

const prisma = new PrismaClient()

// Password hashing using Web Crypto API (same as lib/auth.ts)
async function hashPassword(password: string): Promise<string> {
  const ITERATIONS = 100000
  const HASH_LENGTH = 32
  const ALGORITHM = 'SHA-256'

  const salt = webcrypto.getRandomValues(new Uint8Array(16))

  const passwordKey = await webcrypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  const hashBuffer = await webcrypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: ALGORITHM,
    },
    passwordKey,
    HASH_LENGTH * 8
  )

  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashBase64 = Buffer.from(hashArray).toString('base64')
  const saltBase64 = Buffer.from(salt).toString('base64')

  return `${ITERATIONS}:${saltBase64}:${hashBase64}`
}

async function main() {
  console.log('🌱 Starting database seeding...')

  // Hash passwords using Web Crypto API
  const adminPassword = await hashPassword('admin123')
  const testPassword = await hashPassword('test123')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin',
      password: adminPassword,
      role: 'admin',
    },
  })
  console.log('✓ Created admin user:', admin.email)

  // Create test users
  const testUser1 = await prisma.user.upsert({
    where: { email: 'john' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john',
      password: testPassword,
      role: 'member',
    },
  })
  console.log('✓ Created test user:', testUser1.email)

  const testUser2 = await prisma.user.upsert({
    where: { email: 'jane' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane',
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
  console.log('Admin: admin / admin123')
  console.log('User 1: john / test123')
  console.log('User 2: jane / test123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
