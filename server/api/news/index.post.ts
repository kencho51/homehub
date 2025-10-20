import { getDb } from '~/lib/db'
import { requireAuth } from '~/lib/auth'
import { validateBody, newsEntrySchema } from '~/lib/validation'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)
    const data = await validateBody(event, newsEntrySchema)
    
    const db = getDb(event)
    
    // Create news entry
    const newsEntry = await db.newsEntry.create({
      data: {
        title: data.title,
        content: data.content,
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

