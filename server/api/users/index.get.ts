import { getDb } from '~/lib/db'
import { requireAdmin } from '~/lib/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAdmin(event)
    const db = getDb(event)

    // Get all users (excluding passwords)
    const users = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      users,
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
