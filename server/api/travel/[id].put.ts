import { getDb } from '~/lib/db'
import { requireAuth } from '~/lib/auth'
import { validateBody, updateTravelPlanSchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const db = getDb(event)
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        message: 'Travel plan ID is required'
      })
    }
    
    // Check if travel plan exists
    const existingPlan = await db.travelPlan.findUnique({
      where: { id }
    })
    
    if (!existingPlan) {
      throw createError({
        statusCode: 404,
        message: 'Travel plan not found'
      })
    }
    
    // Check if user is the creator or admin
    if (existingPlan.createdBy !== user.userId && user.role !== 'admin') {
      throw createError({
        statusCode: 403,
        message: 'Forbidden: You can only update your own travel plans'
      })
    }
    
    const data = await validateBody(event, updateTravelPlanSchema)
    
    // Update travel plan
    const updatedPlan = await db.travelPlan.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.destination && { destination: data.destination }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate && { endDate: new Date(data.endDate) }),
        ...(data.itinerary !== undefined && { itinerary: data.itinerary }),
        ...(data.budget !== undefined && { budget: data.budget }),
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
      travelPlan: updatedPlan
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

