import { getDb } from '~/lib/db'
import { requireAuth } from '~/lib/auth'

export default defineEventHandler(async (event) => {
  try {
    await requireAuth(event)
    const db = getDb(event)
    
    // Get query parameters for filtering
    const query = getQuery(event)
    const startDate = query.startDate as string | undefined
    const endDate = query.endDate as string | undefined
    
    // Build where clause
    const where: any = {}
    
    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      }
    }
    
    // Get calendar events
    const events = await db.calendarEvent.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    })
    
    return {
      success: true,
      events
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

