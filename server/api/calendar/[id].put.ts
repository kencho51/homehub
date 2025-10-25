import { getDb } from '~/lib/db'
import { requireAuth } from '~/lib/auth'
import { validateBody, updateCalendarEventSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const db = getDb(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Event ID is required',
      })
    }

    // Check if event exists
    const existingEvent = await db.calendarEvent.findUnique({
      where: { id },
    })

    if (!existingEvent) {
      throw createError({
        statusCode: 404,
        message: 'Event not found',
      })
    }

    // Check if user is the creator or admin
    if (existingEvent.createdBy !== user.userId && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden: You can only update your own events',
      })
    }

    const data = await validateBody(event, updateCalendarEventSchema)

    // Update calendar event
    const updatedEvent = await db.calendarEvent.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.allDay !== undefined && { allDay: data.allDay }),
        ...(data.isRecurring !== undefined && { isRecurring: data.isRecurring }),
        ...(data.recurrencePattern !== undefined && { recurrencePattern: data.recurrencePattern }),
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return {
      success: true,
      event: updatedEvent,
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
