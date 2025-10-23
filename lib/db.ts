import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'
import type { H3Event } from 'h3'

// Global prisma instance cache
let prisma: PrismaClient | null = null

// Initialize Prisma with D1 adapter for Cloudflare
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPrismaClient(d1Database?: any) {
  if (d1Database) {
    // When running on Cloudflare with D1 (both local and production)
    const adapter = new PrismaD1(d1Database)
    return new PrismaClient({ adapter })
  }

  // Fallback for development without D1 binding (uses SQLite file via DATABASE_URL)
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

// Helper to get DB from Nuxt event (Cloudflare context)
export function getDb(event: H3Event): PrismaClient {
  // Try to get D1 database from Cloudflare context
  // This works both in production (Cloudflare Pages) and local dev (wrangler pages dev)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const d1 = (event.context as any).cloudflare?.env?.homehubdb

  if (!d1) {
    console.warn('D1 database binding not found. Using fallback SQLite connection.')

    console.warn('Make sure to run: npm run dev:d1 or wrangler pages dev')
  }

  return getPrismaClient(d1)
}
