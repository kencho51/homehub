import { webcrypto } from 'node:crypto'

/**
 * Generate password hashes for seed data using Web Crypto API
 *
 * This utility generates password hashes that match the test credentials:
 * - admin / admin123 (Admin User)
 * - john / test123 (John Doe)
 * - jane / test123 (Jane Smith)
 *
 * Uses PBKDF2 (Web Crypto API) - compatible with Cloudflare Workers
 *
 * Note: Each hash is unique due to random salts, but all valid hashes
 * for the same password will verify correctly.
 *
 * Usage: npm run tsx scripts/generate-hashes.ts
 */

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

async function generateHashes() {
  console.log('🔐 Generating password hashes using Web Crypto API (PBKDF2)...\n')

  const admin123 = await hashPassword('admin123')
  const test123 = await hashPassword('test123')

  console.log('Admin User (admin):')
  console.log('  Password: admin123')
  console.log('  Hash: ' + admin123)

  console.log('\nTest Users (john, jane):')
  console.log('  Password: test123')
  console.log('  Hash: ' + test123)

  console.log('\n📝 Use these hashes in your seed data.')
  console.log('✨ Compatible with both Node.js and Cloudflare Workers!')
}

generateHashes()
