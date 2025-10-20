<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-900">Family News</h1>
      <Button @click="openCreateModal">Post News</Button>
    </div>

    <div v-if="loading" class="text-center py-12">
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
              <Button size="sm" variant="outline" @click="editNews(news)">Edit</Button>
              <Button size="sm" variant="destructive" @click="deleteNews(news.id)">Delete</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p class="text-gray-700 whitespace-pre-wrap">{{ news.content }}</p>
        </CardContent>
      </Card>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card class="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>{{ editingNews ? 'Edit News' : 'Post News' }}</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="title">Title</Label>
              <Input id="title" v-model="form.title" required />
            </div>
            <div class="space-y-2">
              <Label for="content">Content</Label>
              <textarea
                id="content"
                v-model="form.content"
                class="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Write your news update..."
                required
              />
            </div>
            <div v-if="error" class="text-sm text-destructive">{{ error }}</div>
            <div class="flex space-x-2">
              <Button type="submit" :disabled="submitting">{{ submitting ? 'Posting...' : 'Post' }}</Button>
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
const newsEntries = ref<any[]>([])
const loading = ref(true)
const showModal = ref(false)
const editingNews = ref<any>(null)
const error = ref('')
const submitting = ref(false)

const form = ref({
  title: '',
  content: ''
})

onMounted(async () => {
  await fetchNews()
})

const fetchNews = async () => {
  loading.value = true
  try {
    const response = await fetchWithAuth('/api/news')
    if (response.success) {
      newsEntries.value = response.newsEntries
    }
  } catch (err) {
    console.error('Failed to fetch news:', err)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingNews.value = null
  form.value = {
    title: '',
    content: ''
  }
  showModal.value = true
}

const editNews = (news: any) => {
  editingNews.value = news
  form.value = {
    title: news.title,
    content: news.content
  }
  showModal.value = true
}

const handleSubmit = async () => {
  error.value = ''
  submitting.value = true

  try {
    const url = editingNews.value
      ? `/api/news/${editingNews.value.id}`
      : '/api/news'
    
    const method = editingNews.value ? 'PUT' : 'POST'

    const response = await fetchWithAuth(url, {
      method,
      body: {
        title: form.value.title,
        content: form.value.content
      }
    })

    if (response.success) {
      await fetchNews()
      closeModal()
    }
  } catch (err: any) {
    error.value = err.data?.message || 'Failed to post news'
  } finally {
    submitting.value = false
  }
}

const deleteNews = async (id: string) => {
  if (!confirm('Are you sure you want to delete this news entry?')) return

  try {
    await fetchWithAuth(`/api/news/${id}`, { method: 'DELETE' })
    await fetchNews()
  } catch (err) {
    console.error('Failed to delete news:', err)
  }
}

const closeModal = () => {
  showModal.value = false
  editingNews.value = null
  error.value = ''
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

