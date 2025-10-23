import { getDb } from '~/lib/db'
import { requireAdmin, hashPassword } from '~/lib/auth'
import { validateBody, updateUserSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)
    const db = getDb(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required',
      })
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    })

    if (!existingUser) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

    const data = await validateBody(event, updateUserSchema)

    // If username is being changed, check if it's already taken
    if (data.email && data.email !== existingUser.email) {
      const userWithEmail = await db.user.findUnique({
        where: { email: data.email },
      })

      if (userWithEmail) {
        throw createError({
          statusCode: 409,
          message: 'Username already exists',
        })
      }
    }

    // Hash password if it's being updated
    let hashedPassword
    if (data.password) {
      hashedPassword = await hashPassword(data.password)
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.email && { email: data.email }),
        ...(hashedPassword && { password: hashedPassword }),
        ...(data.role && { role: data.role }),
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
      user: updatedUser,
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
