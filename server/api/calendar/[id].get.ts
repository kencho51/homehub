import { getDb } from '~/lib/db'
import { requireAuth } from '~/lib/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event)
    const db = getDb(event)
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Event ID is required'
      })
    }
    
    const calendarEvent = await db.calendarEvent.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
    
    if (!calendarEvent) {
      throw createError({
        statusCode: 404,
        message: 'Event not found'
      })
    }
    
    return {
      success: true,
      event: calendarEvent
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

