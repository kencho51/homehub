<template>
  <div>
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Family Hub Dashboard</h1>
      <p class="mt-2 text-gray-600">
        Stay connected with your family's events, travel plans, and news.
      </p>
    </div>

    <!-- Tabs -->
    <div class="border-b border-gray-200 mb-6">
      <nav class="flex space-x-8">
        <button
          @click="activeTab = 'calendar'"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'calendar'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          <span class="flex items-center gap-2">
            <span>📅</span>
            <span>Family Calendar</span>
          </span>
        </button>
        <button
          @click="activeTab = 'news'"
          :class="[
            'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
            activeTab === 'news'
              ? 'border-primary text-primary'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          <span class="flex items-center gap-2">
            <span>📰</span>
            <span>Family News</span>
          </span>
        </button>
      </nav>
    </div>

    <!-- Calendar Tab -->
    <div v-if="activeTab === 'calendar'">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Family Calendar</h2>
        <Button @click="openCalendarModal">Add Event</Button>
      </div>

      <div v-if="loadingEvents" class="text-center py-12">
        <p class="text-gray-600">Loading...</p>
      </div>

      <CalendarGrid
        v-else
        :items="expandedEvents"
        @item-edit="handleCalendarQuickEdit"
        @item-delete="handleCalendarDelete"
        @slot-click="handleCalendarSlotClick"
      />
    </div>

    <!-- News Tab -->
    <div v-if="activeTab === 'news'">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">Family News</h2>
        <Button @click="openNewsModal">Post News</Button>
      </div>

      <div v-if="loadingNews" class="text-center py-12">
        <p class="text-gray-600">Loading news...</p>
      </div>

      <div v-else-if="newsEntries.length === 0" class="text-center py-12">
        <p class="text-gray-600">No news yet. Post your first update!</p>
      </div>

      <div v-else class="space-y-6">
        <Card v-for="news in newsEntries" :key="news.id">
          <CardHeader>
            <div class="flex justify-between items-start">
              <div>
                <CardTitle>{{ news.title }}</CardTitle>
                <CardDescription>
                  By {{ news.creator.name }} • {{ formatDateTime(news.createdAt) }}
                </CardDescription>
              </div>
              <div class="flex space-x-2">
                <Button size="sm" variant="outline" @click="editNewsItem(news)">Edit</Button>
                <Button size="sm" variant="destructive" @click="deleteNewsItem(news.id)">
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p class="text-gray-700 whitespace-pre-wrap">{{ news.content }}</p>
          </CardContent>
        </Card>
      </div>
    </div>

    <!-- Calendar Event Modal -->
    <div
      v-if="showCalendarModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
    >
      <Card class="w-full max-w-2xl my-8">
        <CardHeader>
          <CardTitle>{{ editingEvent ? 'Edit Event' : 'Create Event' }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleCalendarSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="event-title">Title</Label>
              <Input id="event-title" v-model="calendarForm.title" required />
            </div>
            <div class="space-y-2">
              <Label for="event-description">Description</Label>
              <Input id="event-description" v-model="calendarForm.description" />
            </div>
            <div class="space-y-2">
              <Label for="event-location">Location</Label>
              <Input id="event-location" v-model="calendarForm.location" />
            </div>

            <!-- All Day Toggle -->
            <div class="flex items-center space-x-2">
              <input
                id="event-allday"
                type="checkbox"
                v-model="calendarForm.allDay"
                class="h-4 w-4 rounded border-gray-300"
              />
              <Label for="event-allday" class="!mt-0 cursor-pointer">All Day Event</Label>
            </div>

            <!-- Date and Time Fields -->
            <div v-if="!calendarForm.allDay" class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="event-start-date">Start Date</Label>
                <Input
                  id="event-start-date"
                  v-model="calendarForm.startDate"
                  type="date"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="event-start-time">Start Time</Label>
                <Input
                  id="event-start-time"
                  v-model="calendarForm.startTime"
                  type="time"
                  required
                />
              </div>
            </div>

            <div v-if="calendarForm.allDay" class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="event-start-date-allday">Start Date</Label>
                <Input
                  id="event-start-date-allday"
                  v-model="calendarForm.startDate"
                  type="date"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="event-end-date-allday">End Date</Label>
                <Input
                  id="event-end-date-allday"
                  v-model="calendarForm.endDate"
                  type="date"
                  required
                />
              </div>
            </div>

            <!-- Duration (for non-all-day events) -->
            <div v-if="!calendarForm.allDay" class="space-y-2">
              <Label for="event-duration">Duration (hours)</Label>
              <Input
                id="event-duration"
                v-model.number="calendarForm.duration"
                type="number"
                min="0.5"
                step="0.5"
                required
              />
            </div>

            <!-- Recurrence Section -->
            <div class="border-t pt-4 space-y-4">
              <div class="flex items-center space-x-2">
                <input
                  id="event-recurring"
                  type="checkbox"
                  v-model="calendarForm.isRecurring"
                  class="h-4 w-4 rounded border-gray-300"
                />
                <Label for="event-recurring" class="!mt-0 cursor-pointer">Recurring Event</Label>
              </div>

              <div v-if="calendarForm.isRecurring" class="space-y-4 pl-6">
                <!-- Days of Week -->
                <div class="space-y-2">
                  <Label>Repeat on</Label>
                  <div class="flex flex-wrap gap-2">
                    <label
                      v-for="(day, index) in ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']"
                      :key="index"
                      class="flex items-center space-x-1 px-3 py-2 border rounded cursor-pointer"
                      :class="
                        calendarForm.recurrence.daysOfWeek.includes(index)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background'
                      "
                    >
                      <input
                        type="checkbox"
                        :value="index"
                        v-model="calendarForm.recurrence.daysOfWeek"
                        class="sr-only"
                      />
                      <span class="text-sm">{{ day }}</span>
                    </label>
                  </div>
                </div>

                <!-- Recurrence End -->
                <div class="space-y-2">
                  <Label>Ends</Label>
                  <div class="space-y-2">
                    <label class="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="never"
                        v-model="calendarForm.recurrence.endType"
                        class="h-4 w-4"
                      />
                      <span class="text-sm">Never</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="on"
                        v-model="calendarForm.recurrence.endType"
                        class="h-4 w-4"
                      />
                      <span class="text-sm">On</span>
                      <Input
                        v-if="calendarForm.recurrence.endType === 'on'"
                        v-model="calendarForm.recurrence.endDate"
                        type="date"
                        class="w-auto"
                        required
                      />
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        type="radio"
                        value="after"
                        v-model="calendarForm.recurrence.endType"
                        class="h-4 w-4"
                      />
                      <span class="text-sm">After</span>
                      <Input
                        v-if="calendarForm.recurrence.endType === 'after'"
                        v-model.number="calendarForm.recurrence.endAfterOccurrences"
                        type="number"
                        min="1"
                        class="w-20"
                        required
                      />
                      <span v-if="calendarForm.recurrence.endType === 'after'" class="text-sm"
                        >occurrences</span
                      >
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="calendarError" class="text-sm text-destructive">{{ calendarError }}</div>
            <div class="flex space-x-2">
              <Button type="submit" :disabled="calendarSubmitting">
                {{ calendarSubmitting ? 'Saving...' : 'Save' }}
              </Button>
              <Button type="button" variant="outline" @click="closeCalendarModal">Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- News Modal -->
    <div
      v-if="showNewsModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <Card class="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{{ editingNews ? 'Edit News' : 'Post News' }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleNewsSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="news-title">Title</Label>
              <Input id="news-title" v-model="newsForm.title" required />
            </div>
            <div class="space-y-2">
              <Label for="news-content">Content</Label>
              <textarea
                id="news-content"
                v-model="newsForm.content"
                class="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Write your news update..."
                required
              />
            </div>
            <div v-if="newsError" class="text-sm text-destructive">{{ newsError }}</div>
            <div class="flex space-x-2">
              <Button type="submit" :disabled="newsSubmitting">
                {{ newsSubmitting ? 'Posting...' : 'Post' }}
              </Button>
              <Button type="button" variant="outline" @click="closeNewsModal">Cancel</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- Calendar Quick Edit Modal -->
    <div
      v-if="showCalendarQuickEdit"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <Card class="w-full max-w-md">
        <CardHeader>
          <CardTitle>Quick Edit: {{ quickEditingEvent?.title }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleCalendarQuickEditSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="quick-event-description">Description</Label>
              <textarea
                id="quick-event-description"
                v-model="calendarQuickEditForm.description"
                class="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Event description..."
              />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="quick-event-start">Start Time</Label>
                <Input
                  id="quick-event-start"
                  v-model="calendarQuickEditForm.startDate"
                  type="datetime-local"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="quick-event-end">End Time</Label>
                <Input
                  id="quick-event-end"
                  v-model="calendarQuickEditForm.endDate"
                  type="datetime-local"
                  required
                />
              </div>
            </div>
            <div v-if="calendarError" class="text-sm text-destructive">{{ calendarError }}</div>
            <div class="flex space-x-2">
              <Button type="submit" :disabled="calendarSubmitting">
                {{ calendarSubmitting ? 'Saving...' : 'Save' }}
              </Button>
              <Button type="button" variant="outline" @click="showCalendarQuickEdit = false">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import CalendarGrid from '~/components/CalendarGrid.vue'
import { expandRecurringEvents, getCalendarRange } from '~/lib/recurrence'

definePageMeta({
  middleware: ['auth'],
})

const { fetchWithAuth } = useApi()

// Tab state
const activeTab = ref<'calendar' | 'travel' | 'news'>('calendar')

// Calendar state
const events = ref<any[]>([])
const loadingEvents = ref(true)
const showCalendarModal = ref(false)
const showCalendarQuickEdit = ref(false)

// Computed property to expand recurring events into individual occurrences
const expandedEvents = computed(() => {
  // Get a reasonable date range for the current view
  const now = new Date()
  const range = getCalendarRange(now, 'month') // Default to month view range

  // Expand recurring events
  return expandRecurringEvents(events.value, range.start, range.end)
})
const editingEvent = ref<any>(null)
const quickEditingEvent = ref<any>(null)
const calendarError = ref('')
const calendarSubmitting = ref(false)
const calendarForm = ref({
  title: '',
  description: '',
  location: '',
  startDate: '',
  startTime: '',
  endDate: '',
  endTime: '',
  duration: 1, // in hours
  allDay: false,
  isRecurring: false,
  recurrence: {
    daysOfWeek: [] as number[], // 0=Sunday, 1=Monday, ..., 6=Saturday
    endType: 'never' as 'never' | 'on' | 'after',
    endDate: '',
    endAfterOccurrences: 10,
  },
})
const calendarQuickEditForm = ref({
  description: '',
  startDate: '',
  endDate: '',
})

// News state
const newsEntries = ref<any[]>([])
const loadingNews = ref(true)
const showNewsModal = ref(false)
const editingNews = ref<any>(null)
const newsError = ref('')
const newsSubmitting = ref(false)
const newsForm = ref({
  title: '',
  content: '',
})

onMounted(async () => {
  await Promise.all([fetchEvents(), fetchNews()])
})

// Calendar functions
const fetchEvents = async () => {
  loadingEvents.value = true
  try {
    const response = await fetchWithAuth('/api/calendar')
    if (response.success) {
      events.value = response.events
    }
  } catch (err) {
    console.error('Failed to fetch events:', err)
  } finally {
    loadingEvents.value = false
  }
}

const openCalendarModal = () => {
  editingEvent.value = null
  const now = new Date()
  const startDateStr = now.toISOString().slice(0, 10)
  const startTimeStr = now.toTimeString().slice(0, 5)
  calendarForm.value = {
    title: '',
    description: '',
    location: '',
    startDate: startDateStr,
    startTime: startTimeStr,
    endDate: startDateStr,
    endTime: startTimeStr,
    duration: 1,
    allDay: false,
    isRecurring: false,
    recurrence: {
      daysOfWeek: [],
      endType: 'never',
      endDate: '',
      endAfterOccurrences: 10,
    },
  }
  showCalendarModal.value = true
}

const editCalendarEvent = (event: any) => {
  editingEvent.value = event
  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate)
  const recurrencePattern = event.recurrencePattern ? JSON.parse(event.recurrencePattern) : null

  calendarForm.value = {
    title: event.title,
    description: event.description || '',
    location: event.location || '',
    startDate: startDate.toISOString().slice(0, 10),
    startTime: startDate.toTimeString().slice(0, 5),
    endDate: endDate.toISOString().slice(0, 10),
    endTime: endDate.toTimeString().slice(0, 5),
    duration: Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60)),
    allDay: event.allDay,
    isRecurring: event.isRecurring || false,
    recurrence: recurrencePattern || {
      daysOfWeek: [],
      endType: 'never',
      endDate: '',
      endAfterOccurrences: 10,
    },
  }
  showCalendarModal.value = true
}

const handleCalendarSubmit = async () => {
  calendarError.value = ''
  calendarSubmitting.value = true

  try {
    // Calculate start and end dates
    let startDate: Date
    let endDate: Date

    if (calendarForm.value.allDay) {
      // For all-day events, use the date as-is
      startDate = new Date(calendarForm.value.startDate)
      startDate.setHours(0, 0, 0, 0)
      endDate = new Date(calendarForm.value.endDate)
      endDate.setHours(23, 59, 59, 999)
    } else {
      // For timed events, combine date and time
      startDate = new Date(`${calendarForm.value.startDate}T${calendarForm.value.startTime}`)
      // Calculate end time based on duration
      endDate = new Date(startDate.getTime() + calendarForm.value.duration * 60 * 60 * 1000)
    }

    // Prepare recurrence pattern if recurring
    const recurrencePattern = calendarForm.value.isRecurring
      ? JSON.stringify({
          daysOfWeek: calendarForm.value.recurrence.daysOfWeek,
          endType: calendarForm.value.recurrence.endType,
          endDate: calendarForm.value.recurrence.endDate || null,
          endAfterOccurrences: calendarForm.value.recurrence.endAfterOccurrences,
        })
      : null

    const url = editingEvent.value ? `/api/calendar/${editingEvent.value.id}` : '/api/calendar'
    const method = editingEvent.value ? 'PUT' : 'POST'

    const response = await fetchWithAuth(url, {
      method,
      body: {
        title: calendarForm.value.title,
        description: calendarForm.value.description || null,
        location: calendarForm.value.location || null,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        allDay: calendarForm.value.allDay,
        isRecurring: calendarForm.value.isRecurring,
        recurrencePattern,
      },
    })

    if (response.success) {
      await fetchEvents()
      closeCalendarModal()
    }
  } catch (err: any) {
    calendarError.value = err.data?.message || 'Failed to save event'
  } finally {
    calendarSubmitting.value = false
  }
}

const handleCalendarDelete = async (event: any) => {
  // Check if this is a recurring event instance
  const isRecurringInstance = event._isRecurrenceInstance
  const eventIdToDelete = isRecurringInstance ? event._baseEventId : event.id

  // Customize confirmation message for recurring events
  const confirmMessage = isRecurringInstance
    ? 'This is a recurring event. Deleting it will remove all occurrences. Are you sure?'
    : 'Are you sure you want to delete this event?'

  if (!confirm(confirmMessage)) return

  try {
    await fetchWithAuth(`/api/calendar/${eventIdToDelete}`, { method: 'DELETE' })
    await fetchEvents()
  } catch (err) {
    console.error('Failed to delete event:', err)
  }
}

const closeCalendarModal = () => {
  showCalendarModal.value = false
  editingEvent.value = null
  calendarError.value = ''
}

const handleCalendarSlotClick = (slotDate: Date) => {
  editingEvent.value = null
  const startDate = new Date(slotDate)
  const startDateStr = startDate.toISOString().slice(0, 10)
  const startTimeStr = startDate.toTimeString().slice(0, 5)

  calendarForm.value = {
    title: '',
    description: '',
    location: '',
    startDate: startDateStr,
    startTime: startTimeStr,
    endDate: startDateStr,
    endTime: startTimeStr,
    duration: 1,
    allDay: false,
    isRecurring: false,
    recurrence: {
      daysOfWeek: [],
      endType: 'never',
      endDate: '',
      endAfterOccurrences: 10,
    },
  }
  showCalendarModal.value = true
}

const handleCalendarQuickEdit = (event: any) => {
  // If this is a recurring event instance, warn the user
  if (event._isRecurrenceInstance) {
    const shouldProceed = confirm(
      'This is a recurring event. Editing it will change all occurrences. Do you want to continue?'
    )
    if (!shouldProceed) return

    // Find and edit the base event instead
    const baseEvent = events.value.find((e) => e.id === event._baseEventId)
    if (baseEvent) {
      editCalendarEvent(baseEvent)
      return
    }
  }

  quickEditingEvent.value = event
  calendarQuickEditForm.value = {
    description: event.description || '',
    startDate: new Date(event.startDate).toISOString().slice(0, 16),
    endDate: new Date(event.endDate).toISOString().slice(0, 16),
  }
  showCalendarQuickEdit.value = true
}

const handleCalendarQuickEditSubmit = async () => {
  calendarError.value = ''
  calendarSubmitting.value = true

  try {
    const response = await fetchWithAuth(`/api/calendar/${quickEditingEvent.value.id}`, {
      method: 'PUT',
      body: {
        title: quickEditingEvent.value.title,
        description: calendarQuickEditForm.value.description || undefined,
        location: quickEditingEvent.value.location,
        startDate: new Date(calendarQuickEditForm.value.startDate).toISOString(),
        endDate: new Date(calendarQuickEditForm.value.endDate).toISOString(),
        allDay: quickEditingEvent.value.allDay,
      },
    })

    if (response.success) {
      await fetchEvents()
      showCalendarQuickEdit.value = false
      quickEditingEvent.value = null
    }
  } catch (err: any) {
    calendarError.value = err.data?.message || 'Failed to update event'
  } finally {
    calendarSubmitting.value = false
  }
}

// News functions
const fetchNews = async () => {
  loadingNews.value = true
  try {
    const response = await fetchWithAuth('/api/news')
    if (response.success) {
      newsEntries.value = response.newsEntries
    }
  } catch (err) {
    console.error('Failed to fetch news:', err)
  } finally {
    loadingNews.value = false
  }
}

const openNewsModal = () => {
  editingNews.value = null
  newsForm.value = {
    title: '',
    content: '',
  }
  showNewsModal.value = true
}

const editNewsItem = (news: any) => {
  editingNews.value = news
  newsForm.value = {
    title: news.title,
    content: news.content,
  }
  showNewsModal.value = true
}

const handleNewsSubmit = async () => {
  newsError.value = ''
  newsSubmitting.value = true

  try {
    const url = editingNews.value ? `/api/news/${editingNews.value.id}` : '/api/news'
    const method = editingNews.value ? 'PUT' : 'POST'

    const response = await fetchWithAuth(url, {
      method,
      body: {
        title: newsForm.value.title,
        content: newsForm.value.content,
      },
    })

    if (response.success) {
      await fetchNews()
      closeNewsModal()
    }
  } catch (err: any) {
    newsError.value = err.data?.message || 'Failed to post news'
  } finally {
    newsSubmitting.value = false
  }
}

const deleteNewsItem = async (id: string) => {
  if (!confirm('Are you sure you want to delete this news entry?')) return

  try {
    await fetchWithAuth(`/api/news/${id}`, { method: 'DELETE' })
    await fetchNews()
  } catch (err) {
    console.error('Failed to delete news:', err)
  }
}

const closeNewsModal = () => {
  showNewsModal.value = false
  editingNews.value = null
  newsError.value = ''
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
