import { getDb } from '~/lib/db'
import { hashPassword, generateToken } from '~/lib/auth'
import { validateBody, registerSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  try {
    // Validate request body
    const data = await validateBody(event, registerSchema)
    
    const db = getDb(event)
    
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'User with this email already exists'
      })
    }
    
    // Hash password
    const hashedPassword = await hashPassword(data.password)
    
    // Create user
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: 'member'
      }
    })
    
    // Generate JWT token
    const token = await generateToken(user.id, user.email, user.role, config.jwtSecret)
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
})

