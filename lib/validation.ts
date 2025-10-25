import { z } from 'zod'

// User validation schemas
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().min(1, 'Username is required').max(100),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
})

export const loginSchema = z.object({
  email: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().min(1, 'Username is required').max(100),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100),
  role: z.enum(['admin', 'member']).default('member'),
})

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).optional(),
  email: z.string().min(1, 'Username is required').max(100).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100).optional(),
  role: z.enum(['admin', 'member']).optional(),
})

// Calendar event validation schemas
export const calendarEventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  location: z.string().max(200).optional().nullable(),
  allDay: z.boolean().optional().default(false),
  isRecurring: z.boolean().optional().default(false),
  recurrencePattern: z.string().optional().nullable(),
})

export const updateCalendarEventSchema = calendarEventSchema.partial()

// Travel plan validation schemas
export const travelPlanSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  destination: z.string().min(1, 'Destination is required').max(200),
  description: z.string().max(2000).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  itinerary: z.string().max(10000).optional(),
  budget: z.number().positive().optional(),
})

export const updateTravelPlanSchema = travelPlanSchema.partial()

// News entry validation schemas
export const newsEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required').max(10000),
})

export const updateNewsEntrySchema = newsEntrySchema.partial()

// Helper to validate request body
export async function validateBody<T>(event: any, schema: z.ZodSchema<T>): Promise<T> {
  try {
    const body = await readBody(event)
    return schema.parse(body)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        message: 'Validation error',
        data: error.errors,
      })
    }
    throw error
  }
}
