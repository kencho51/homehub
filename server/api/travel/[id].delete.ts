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
        message: 'Forbidden: You can only delete your own travel plans'
      })
    }
    
    // Delete travel plan
    await db.travelPlan.delete({
      where: { id }
    })
    
    return {
      success: true,
      message: 'Travel plan deleted successfully'
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

