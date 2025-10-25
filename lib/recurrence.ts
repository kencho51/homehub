/**
 * Recurrence utilities for expanding recurring calendar events
 */

interface RecurrencePattern {
  daysOfWeek: number[] // 0=Sunday, 1=Monday, ..., 6=Saturday
  endType: 'never' | 'on' | 'after'
  endDate?: string
  endAfterOccurrences?: number
}

interface CalendarEvent {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  location?: string
  allDay: boolean
  isRecurring: boolean
  recurrencePattern?: string
  [key: string]: any
}

/**
 * Expands recurring events into individual occurrences
 * @param events Array of calendar events (some may be recurring)
 * @param rangeStart Start date for generating occurrences
 * @param rangeEnd End date for generating occurrences
 * @returns Array of events with recurring events expanded into individual occurrences
 */
export function expandRecurringEvents(
  events: CalendarEvent[],
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  const expandedEvents: CalendarEvent[] = []

  for (const event of events) {
    if (!event.isRecurring || !event.recurrencePattern) {
      // Non-recurring event, add as-is
      expandedEvents.push(event)
      continue
    }

    try {
      const pattern: RecurrencePattern = JSON.parse(event.recurrencePattern)
      const occurrences = generateOccurrences(event, pattern, rangeStart, rangeEnd)
      expandedEvents.push(...occurrences)
    } catch (error) {
      console.error('Failed to parse recurrence pattern for event:', event.id, error)
      // If parsing fails, add the original event
      expandedEvents.push(event)
    }
  }

  return expandedEvents
}

/**
 * Generates individual occurrences for a recurring event
 */
function generateOccurrences(
  baseEvent: CalendarEvent,
  pattern: RecurrencePattern,
  rangeStart: Date,
  rangeEnd: Date
): CalendarEvent[] {
  const occurrences: CalendarEvent[] = []
  const eventStart = new Date(baseEvent.startDate)
  const eventEnd = new Date(baseEvent.endDate)
  const duration = eventEnd.getTime() - eventStart.getTime()

  // Determine the end date for recurrence
  let recurrenceEndDate: Date
  if (pattern.endType === 'on' && pattern.endDate) {
    recurrenceEndDate = new Date(pattern.endDate)
    recurrenceEndDate.setHours(23, 59, 59, 999)
  } else if (pattern.endType === 'never') {
    // For "never", we still need a practical limit. Use rangeEnd + 1 year
    recurrenceEndDate = new Date(rangeEnd)
    recurrenceEndDate.setFullYear(recurrenceEndDate.getFullYear() + 1)
  } else {
    // For "after", we'll handle count separately
    recurrenceEndDate = new Date(rangeEnd)
    recurrenceEndDate.setFullYear(recurrenceEndDate.getFullYear() + 1)
  }

  // Don't go beyond our display range too much (performance)
  const maxEndDate = new Date(rangeEnd)
  maxEndDate.setFullYear(maxEndDate.getFullYear() + 1)
  if (recurrenceEndDate > maxEndDate) {
    recurrenceEndDate = maxEndDate
  }

  // Start from the event's start date
  let currentDate = new Date(eventStart)
  // But start searching from the week before rangeStart to catch events that might span into range
  const searchStart = new Date(rangeStart)
  searchStart.setDate(searchStart.getDate() - 7)

  let occurrenceCount = 0
  const maxOccurrences = pattern.endType === 'after' ? pattern.endAfterOccurrences || 10 : Infinity

  // Iterate through dates looking for matching days of week
  while (currentDate <= recurrenceEndDate && occurrenceCount < maxOccurrences) {
    const dayOfWeek = currentDate.getDay()

    // Check if this day of week is in the recurrence pattern
    if (pattern.daysOfWeek.includes(dayOfWeek)) {
      // Check if this occurrence is on or after the event's original start date
      if (currentDate >= eventStart) {
        occurrenceCount++

        // Create occurrence with the same time but on this date
        const occurrenceStart = new Date(currentDate)
        const occurrenceEnd = new Date(occurrenceStart.getTime() + duration)

        // Only add if it overlaps with our display range (or is close to it)
        if (occurrenceEnd >= searchStart && occurrenceStart <= maxEndDate) {
          occurrences.push({
            ...baseEvent,
            id: `${baseEvent.id}-occurrence-${currentDate.toISOString()}`,
            startDate: occurrenceStart.toISOString(),
            endDate: occurrenceEnd.toISOString(),
            // Mark this as a generated occurrence so we can handle edits differently if needed
            _isRecurrenceInstance: true,
            _baseEventId: baseEvent.id,
          })
        }

        // If we've reached the max occurrences, stop
        if (occurrenceCount >= maxOccurrences) {
          break
        }
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return occurrences
}

/**
 * Gets a reasonable date range for expanding recurring events based on current view
 */
export function getCalendarRange(
  currentDate: Date,
  viewMode: 'day' | 'week' | 'month'
): {
  start: Date
  end: Date
} {
  const start = new Date(currentDate)
  const end = new Date(currentDate)

  if (viewMode === 'day') {
    // For day view, show -1 week to +2 weeks
    start.setDate(start.getDate() - 7)
    end.setDate(end.getDate() + 14)
  } else if (viewMode === 'week') {
    // For week view, show -2 weeks to +4 weeks
    start.setDate(start.getDate() - 14)
    end.setDate(end.getDate() + 28)
  } else {
    // For month view, show -2 months to +3 months
    start.setMonth(start.getMonth() - 2)
    end.setMonth(end.getMonth() + 3)
  }

  // Set to start/end of day
  start.setHours(0, 0, 0, 0)
  end.setHours(23, 59, 59, 999)

  return { start, end }
}
