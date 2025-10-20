<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Family Calendar</h1>
      <Button @click="openCreateModal">Add Event</Button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading events...</p>
    </div>

    <div v-else-if="events.length === 0" class="text-center py-12">
      <p class="text-gray-600">No events yet. Create your first event!</p>
    </div>

    <div v-else class="space-y-4">
      <Card v-for="event in events" :key="event.id">
        <CardHeader>
          <div class="flex justify-between items-start">
            <div>
              <CardTitle>{{ event.title }}</CardTitle>
              <CardDescription>
                {{ formatDateTime(event.startDate) }}
                <span v-if="event.location"> • {{ event.location }}</span>
              </CardDescription>
            </div>
            <div class="flex space-x-2">
              <Button size="sm" variant="outline" @click="editEvent(event)">Edit</Button>
              <Button size="sm" variant="destructive" @click="deleteEvent(event.id)">Delete</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent v-if="event.description">
          <p class="text-gray-700">{{ event.description }}</p>
          <p class="text-sm text-gray-500 mt-2">Created by {{ event.creator.name }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card class="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{{ editingEvent ? 'Edit Event' : 'Create Event' }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="title">Title</Label>
              <Input id="title" v-model="form.title" required />
            </div>
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Input id="description" v-model="form.description" />
            </div>
            <div class="space-y-2">
              <Label for="location">Location</Label>
              <Input id="location" v-model="form.location" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="startDate">Start Date</Label>
                <Input id="startDate" v-model="form.startDate" type="datetime-local" required />
              </div>
              <div class="space-y-2">
                <Label for="endDate">End Date</Label>
                <Input id="endDate" v-model="form.endDate" type="datetime-local" required />
              </div>
            </div>
            <div v-if="error" class="text-sm text-destructive">{{ error }}</div>
            <div class="flex space-x-2">
              <Button type="submit" :disabled="submitting">{{ submitting ? 'Saving...' : 'Save' }}</Button>
              <Button type="button" variant="outline" @click="closeModal">Cancel</Button>
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

definePageMeta({
  middleware: ['auth']
})

const { fetchWithAuth } = useApi()
const events = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingEvent = ref<any>(null)
const error = ref('')
const submitting = ref(false)

const form = ref({
  title: '',
  description: '',
  location: '',
  startDate: '',
  endDate: '',
  allDay: false
})

onMounted(async () => {
  await fetchEvents()
})

const fetchEvents = async () => {
  loading.value = true
  try {
    const response = await fetchWithAuth('/api/calendar')
    if (response.success) {
      events.value = response.events
    }
  } catch (err) {
    console.error('Failed to fetch events:', err)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingEvent.value = null
  form.value = {
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    allDay: false
  }
  showModal.value = true
}

const editEvent = (event: any) => {
  editingEvent.value = event
  form.value = {
    title: event.title,
    description: event.description || '',
    location: event.location || '',
    startDate: new Date(event.startDate).toISOString().slice(0, 16),
    endDate: new Date(event.endDate).toISOString().slice(0, 16),
    allDay: event.allDay
  }
  showModal.value = true
}

const handleSubmit = async () => {
  error.value = ''
  submitting.value = true

  try {
    const url = editingEvent.value
      ? `/api/calendar/${editingEvent.value.id}`
      : '/api/calendar'
    
    const method = editingEvent.value ? 'PUT' : 'POST'

    const response = await fetchWithAuth(url, {
      method,
      body: {
        title: form.value.title,
        description: form.value.description || undefined,
        location: form.value.location || undefined,
        startDate: new Date(form.value.startDate).toISOString(),
        endDate: new Date(form.value.endDate).toISOString(),
        allDay: form.value.allDay
      }
    })

    if (response.success) {
      await fetchEvents()
      closeModal()
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to save event'
  } finally {
    submitting.value = false
  }
}

const deleteEvent = async (id: string) => {
  if (!confirm('Are you sure you want to delete this event?')) return

  try {
    await fetchWithAuth(`/api/calendar/${id}`, { method: 'DELETE' })
    await fetchEvents()
  } catch (err) {
    console.error('Failed to delete event:', err)
  }
}

const closeModal = () => {
  showModal.value = false
  editingEvent.value = null
  error.value = ''
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

