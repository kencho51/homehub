import bcrypt from 'bcrypt'

/**
 * Generate bcrypt hashes for seed data
 *
 * This utility generates password hashes that match the test credentials:
 * - admin@family-hub.com / admin123 (Admin User)
 * - john@family-hub.com / test123 (John Doe)
 * - jane@family-hub.com / test123 (Jane Smith)
 *
 * Note: Bcrypt generates different hashes each time due to random salts,
 * but all valid hashes for the same password will verify correctly.
 *
 * The current hashes in prisma/seed.sql are valid. Only regenerate if needed.
 *
 * Usage: npm run tsx scripts/generate-hashes.ts
 */
async function generateHashes() {
  console.log('🔐 Generating bcrypt hashes for seed data...\n')

  const admin123 = await bcrypt.hash('admin123', 10)
  const test123 = await bcrypt.hash('test123', 10)

  console.log('Admin User (admin@family-hub.com):')
  console.log('  Password: admin123')
  console.log('  Hash: ' + admin123)

  console.log('\nTest Users (john@family-hub.com, jane@family-hub.com):')
  console.log('  Password: test123')
  console.log('  Hash: ' + test123)

  console.log('\n📝 If you need to update prisma/seed.sql, use these new hashes.')
  console.log('⚠️  Current hashes in seed.sql are already valid - only update if needed!')
}

generateHashes()
