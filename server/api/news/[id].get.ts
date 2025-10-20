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
        message: 'News entry ID is required'
      })
    }
    
    const newsEntry = await db.newsEntry.findUnique({
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
    
    if (!newsEntry) {
      throw createError({
        statusCode: 404,
        message: 'News entry not found'
      })
    }
    
    return {
      success: true,
      newsEntry
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

