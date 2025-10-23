import { getDb } from '~/lib/db'
import { requireAdmin } from '~/lib/auth'

export default defineEventHandler(async (event) => {
  try {
    const currentUser = await requireAdmin(event)
    const db = getDb(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'User ID is required',
      })
    }

    // Prevent self-deletion
    if (id === currentUser.userId) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete your own account',
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

    // Delete user (cascade will delete related records)
    await db.user.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'User deleted successfully',
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
