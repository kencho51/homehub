import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

// Global prisma instance for server-side use
let prisma: PrismaClient

// Initialize Prisma with D1 adapter for Cloudflare
export function getPrismaClient(d1Database?: D1Database) {
  if (d1Database) {
    // When running on Cloudflare with D1
    const adapter = new PrismaD1(d1Database)
    return new PrismaClient({ adapter })
  }
  
  // For local development (uses SQLite file)
  if (!prisma) {
    prisma = new PrismaClient()
  }
  return prisma
}

// Helper to get DB from Nuxt event (Cloudflare context)
export function getDb(event: any): PrismaClient {
  const d1 = event.context.cloudflare?.env?.DB
  return getPrismaClient(d1)
}

