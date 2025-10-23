import { getDb } from '~/lib/db'
import { requireAdmin } from '~/lib/auth'

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

    // Get user (excluding password)
    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            calendarEvents: true,
            travelPlans: true,
            newsEntries: true,
          },
        },
      },
    })

    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'User not found',
      })
    }

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
