import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

// Compare password with hash
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate JWT token
export async function generateToken(userId: string, email: string, role: string, secret: string): Promise<string> {
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
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    )
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
      message: 'Unauthorized'
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
      message: 'Forbidden: Admin access required'
    })
  }
  
  return user
}

