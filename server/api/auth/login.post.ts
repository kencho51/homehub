import { getDb } from '~/lib/db'
import { comparePassword, generateToken } from '~/lib/auth'
import { validateBody, loginSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  try {
    // Validate request body
    const data = await validateBody(event, loginSchema)

    const db = getDb(event)

    // Find user by username (stored in email field)
    const user = await db.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials',
      })
    }

    // Verify password
    const isValidPassword = await comparePassword(data.password, user.password)

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: 'Invalid credentials',
      })
    }

    // Generate JWT token
    const token = await generateToken(user.id, user.email, user.role, config.jwtSecret)

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }
    throw createError({
      statusCode: 500,
      message: 'Internal server error',
    })
  }
})
