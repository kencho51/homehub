import { getDb } from '~/lib/db'
import { requireAuth } from '~/lib/auth'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const db = getDb(event)
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'News entry ID is required'
      })
    }
    
    // Check if news entry exists
    const existingEntry = await db.newsEntry.findUnique({
      where: { id }
    })
    
    if (!existingEntry) {
      throw createError({
        statusCode: 404,
        message: 'News entry not found'
      })
    }
    
    // Check if user is the creator or admin
    if (existingEntry.createdBy !== user.userId && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden: You can only delete your own news entries'
      })
    }
    
    // Delete news entry
    await db.newsEntry.delete({
      where: { id }
    })
    
    return {
      success: true,
      message: 'News entry deleted successfully'
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

