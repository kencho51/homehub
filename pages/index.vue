<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Welcome to Family Hub</h1>
      <p class="mt-2 text-gray-600">Stay connected with your family's events, travel plans, and news.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Calendar Card -->
      <Card class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>📅 Calendar</CardTitle>
          <CardDescription>View and manage family events</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-600 mb-4">
            Keep track of important dates, family gatherings, and appointments.
          </p>
          <Button as-child class="w-full">
            <NuxtLink to="/calendar">View Calendar</NuxtLink>
          </Button>
        </CardContent>
      </Card>

      <!-- Travel Card -->
      <Card class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>✈️ Travel Plans</CardTitle>
          <CardDescription>Plan your family adventures</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-600 mb-4">
            Organize trips, create itineraries, and manage travel budgets.
          </p>
          <Button as-child class="w-full">
            <NuxtLink to="/travel">View Travel Plans</NuxtLink>
          </Button>
        </CardContent>
      </Card>

      <!-- News Card -->
      <Card class="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle>📰 Family News</CardTitle>
          <CardDescription>Share updates and announcements</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-sm text-gray-600 mb-4">
            Post and read family news, updates, and important announcements.
          </p>
          <Button as-child class="w-full">
            <NuxtLink to="/news">View News</NuxtLink>
          </Button>
        </CardContent>
      </Card>
    </div>

    <!-- Recent News -->
    <div v-if="recentNews.length > 0" class="mt-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">Recent News</h2>
      <div class="space-y-4">
        <Card v-for="news in recentNews" :key="news.id">
          <CardHeader>
            <CardTitle class="text-lg">{{ news.title }}</CardTitle>
            <CardDescription>
              By {{ news.creator.name }} • {{ formatDate(news.createdAt) }}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p class="text-gray-700">{{ truncate(news.content, 200) }}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

definePageMeta({
  middleware: ['auth']
})

const { fetchWithAuth } = useApi()
const recentNews = ref<any[]>([])

onMounted(async () => {
  try {
    const response = await fetchWithAuth('/api/news?limit=3')
    if (response.success) {
      recentNews.value = response.newsEntries
    }
  } catch (error) {
    console.error('Failed to fetch recent news:', error)
  }
})

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const truncate = (text: string, length: number) => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
</script>

