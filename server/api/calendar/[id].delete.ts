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
        message: 'Event ID is required'
      })
    }
    
    // Check if event exists
    const existingEvent = await db.calendarEvent.findUnique({
      where: { id }
    })
    
    if (!existingEvent) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }
    
    // Check if user is the creator or admin
    if (existingEvent.createdBy !== user.userId && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden: You can only delete your own events'
      })
    }
    
    // Delete calendar event
    await db.calendarEvent.delete({
      where: { id }
    })
    
    return {
      success: true,
      message: 'Event deleted successfully'
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

