<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Travel Plans</h1>
      <Button @click="openCreateModal">Add Travel Plan</Button>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-600">Loading travel plans...</p>
    </div>

    <div v-else-if="travelPlans.length === 0" class="text-center py-12">
      <p class="text-gray-600">No travel plans yet. Plan your first adventure!</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card v-for="plan in travelPlans" :key="plan.id" class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div class="flex justify-between items-start">
            <div>
              <CardTitle>{{ plan.title }}</CardTitle>
              <CardDescription>{{ plan.destination }}</CardDescription>
            </div>
            <div class="flex space-x-2">
              <Button size="sm" variant="outline" @click="editPlan(plan)">Edit</Button>
              <Button size="sm" variant="destructive" @click="deletePlan(plan.id)">Delete</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div class="space-y-2">
            <p v-if="plan.description" class="text-gray-700">{{ plan.description }}</p>
            <div class="text-sm text-gray-600">
              <p>📅 {{ formatDate(plan.startDate) }} - {{ formatDate(plan.endDate) }}</p>
              <p v-if="plan.budget">💰 Budget: ${{ plan.budget.toLocaleString() }}</p>
              <p class="mt-2">Created by {{ plan.creator.name }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card class="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>{{ editingPlan ? 'Edit Travel Plan' : 'Create Travel Plan' }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="title">Title</Label>
              <Input id="title" v-model="form.title" required />
            </div>
            <div class="space-y-2">
              <Label for="destination">Destination</Label>
              <Input id="destination" v-model="form.destination" required />
            </div>
            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Input id="description" v-model="form.description" />
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
            <div class="space-y-2">
              <Label for="budget">Budget ($)</Label>
              <Input id="budget" v-model.number="form.budget" type="number" min="0" step="0.01" />
            </div>
            <div class="space-y-2">
              <Label for="itinerary">Itinerary (JSON format)</Label>
              <textarea
                id="itinerary"
                v-model="form.itinerary"
                class="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm"
                placeholder='[{"day": 1, "activity": "Arrival"}]'
              />
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
const travelPlans = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingPlan = ref<any>(null)
const error = ref('')
const submitting = ref(false)

const form = ref({
  title: '',
  destination: '',
  description: '',
  startDate: '',
  endDate: '',
  budget: null as number | null,
  itinerary: ''
})

onMounted(async () => {
  await fetchPlans()
})

const fetchPlans = async () => {
  loading.value = true
  try {
    const response = await fetchWithAuth('/api/travel')
    if (response.success) {
      travelPlans.value = response.travelPlans
    }
  } catch (err) {
    console.error('Failed to fetch travel plans:', err)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingPlan.value = null
  form.value = {
    title: '',
    destination: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: null,
    itinerary: ''
  }
  showModal.value = true
}

const editPlan = (plan: any) => {
  editingPlan.value = plan
  form.value = {
    title: plan.title,
    destination: plan.destination,
    description: plan.description || '',
    startDate: new Date(plan.startDate).toISOString().slice(0, 16),
    endDate: new Date(plan.endDate).toISOString().slice(0, 16),
    budget: plan.budget || null,
    itinerary: plan.itinerary || ''
  }
  showModal.value = true
}

const handleSubmit = async () => {
  error.value = ''
  submitting.value = true

  try {
    const url = editingPlan.value
      ? `/api/travel/${editingPlan.value.id}`
      : '/api/travel'
    
    const method = editingPlan.value ? 'PUT' : 'POST'

    const response = await fetchWithAuth(url, {
      method,
      body: {
        title: form.value.title,
        destination: form.value.destination,
        description: form.value.description || undefined,
        startDate: new Date(form.value.startDate).toISOString(),
        endDate: new Date(form.value.endDate).toISOString(),
        budget: form.value.budget || undefined,
        itinerary: form.value.itinerary || undefined
      }
    })

    if (response.success) {
      await fetchPlans()
      closeModal()
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to save travel plan'
  } finally {
    submitting.value = false
  }
}

const deletePlan = async (id: string) => {
  if (!confirm('Are you sure you want to delete this travel plan?')) return

  try {
    await fetchWithAuth(`/api/travel/${id}`, { method: 'DELETE' })
    await fetchPlans()
  } catch (err) {
    console.error('Failed to delete travel plan:', err)
  }
}

const closeModal = () => {
  showModal.value = false
  editingPlan.value = null
  error.value = ''
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

