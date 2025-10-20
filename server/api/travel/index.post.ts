import { getDb } from '~/lib/db'
import { requireAuth } from '~/lib/auth'
import { validateBody, travelPlanSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const data = await validateBody(event, travelPlanSchema)
    
    const db = getDb(event)
    
    // Create travel plan
    const travelPlan = await db.travelPlan.create({
      data: {
        title: data.title,
        destination: data.destination,
        description: data.description,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        itinerary: data.itinerary,
        budget: data.budget,
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
      travelPlan
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

