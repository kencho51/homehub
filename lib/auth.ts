import { SignJWT, jwtVerify } from 'jose'

const ITERATIONS = 100000
const HASH_LENGTH = 32
const ALGORITHM = 'SHA-256'

/**
 * Hash password using Web Crypto API (PBKDF2)
 * Format: iterations:salt:hash (all base64)
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate random salt
  const salt = crypto.getRandomValues(new Uint8Array(16))

  // Import password as key
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )

  // Derive hash using PBKDF2
  const hashBuffer = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: ITERATIONS,
      hash: ALGORITHM,
    },
    passwordKey,
    HASH_LENGTH * 8
  )

  // Convert to base64 for storage
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashBase64 = btoa(String.fromCharCode(...hashArray))
  const saltArray = Array.from(salt)
  const saltBase64 = btoa(String.fromCharCode(...saltArray))

  return `${ITERATIONS}:${saltBase64}:${hashBase64}`
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, storedHash: string): Promise<boolean> {
  try {
    const [iterationsStr, saltBase64, hashBase64] = storedHash.split(':')

    if (!iterationsStr || !saltBase64 || !hashBase64) {
      return false
    }

    const iterations = parseInt(iterationsStr, 10)

    // Decode salt from base64
    const saltStr = atob(saltBase64)
    const salt = new Uint8Array(saltStr.split('').map((c) => c.charCodeAt(0)))

    // Import password as key
    const passwordKey = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    )

    // Derive hash using same parameters
    const hashBuffer = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: iterations,
        hash: ALGORITHM,
      },
      passwordKey,
      HASH_LENGTH * 8
    )

    // Convert to base64 and compare
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const computedHashBase64 = btoa(String.fromCharCode(...hashArray))

    return computedHashBase64 === hashBase64
  } catch (error) {
    console.error('Password comparison error:', error)
    return false
  }
}

// Generate JWT token
export async function generateToken(
  userId: string,
  email: string,
  role: string,
  secret: string
): Promise<string> {
  const token = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(secret))

  return token
}

// Verify JWT token
export async function verifyToken(token: string, secret: string) {
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret))
    return payload as { userId: string; email: string; role: string }
  } catch (error) {
    return null
  }
}

// Get user from request
export async function getUserFromRequest(event: any) {
  const config = useRuntimeConfig()
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const payload = await verifyToken(token, config.jwtSecret)

  return payload
}

// Middleware to require authentication
export async function requireAuth(event: any) {
  const user = await getUserFromRequest(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  return user
}

// Middleware to require admin role
export async function requireAdmin(event: any) {
  const user = await requireAuth(event)

  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden: Admin access required',
    })
  }

  return user
}
