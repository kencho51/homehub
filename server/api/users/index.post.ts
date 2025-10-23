import { getDb } from '~/lib/db'
import { requireAdmin, hashPassword } from '~/lib/auth'
import { validateBody, createUserSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)
    const db = getDb(event)

    // Validate request body
    const data = await validateBody(event, createUserSchema)

    // Check if username already exists
    const existingUser = await db.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw createError({
        statusCode: 409,
        message: 'Username already exists',
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
        role: data.role || 'member',
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return {
      success: true,
      user,
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
