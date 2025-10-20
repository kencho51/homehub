import { getDb } from '~/lib/db'
import { requireAuth } from '~/lib/auth'
import { validateBody, calendarEventSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const data = await validateBody(event, calendarEventSchema)
    
    const db = getDb(event)
    
    // Create calendar event
    const calendarEvent = await db.calendarEvent.create({
      data: {
        title: data.title,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        location: data.location,
        allDay: data.allDay,
        createdBy: user.userId
      },
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

