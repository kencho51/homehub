<template>
  <div>
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">User Profile</h1>

      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-600">Loading profile...</p>
      </div>

      <div v-else class="space-y-6">
        <!-- Profile Information Card -->
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="text-sm font-medium text-gray-700">Name</label>
                  <p class="mt-1 text-lg">{{ user?.name }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-700">Email</label>
                  <p class="mt-1 text-lg">{{ user?.email }}</p>
                </div>
              </div>
              <div>
                <label class="text-sm font-medium text-gray-700">Account Created</label>
                <p class="mt-1 text-gray-600">{{ formatDate(user?.createdAt) }}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Activity Stats Card -->
        <Card>
          <CardHeader>
            <CardTitle>Activity Stats</CardTitle>
            <CardDescription>Your contributions to Family Hub</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="text-center p-4 bg-blue-50 rounded-lg">
                <div class="text-3xl font-bold text-blue-600">{{ stats.events }}</div>
                <div class="text-sm text-gray-600 mt-1">Calendar Events</div>
              </div>
              <div class="text-center p-4 bg-green-50 rounded-lg">
                <div class="text-3xl font-bold text-green-600">{{ stats.travelPlans }}</div>
                <div class="text-sm text-gray-600 mt-1">Travel Plans</div>
              </div>
              <div class="text-center p-4 bg-purple-50 rounded-lg">
                <div class="text-3xl font-bold text-purple-600">{{ stats.news }}</div>
                <div class="text-sm text-gray-600 mt-1">News Items</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Change Password Card -->
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your password</CardDescription>
          </CardHeader>
          <CardContent>
            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div class="space-y-2">
                <Label for="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  v-model="passwordForm.currentPassword"
                  type="password"
                  required
                />
              </div>
              <div class="space-y-2">
                <Label for="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  v-model="passwordForm.newPassword"
                  type="password"
                  required
                  minlength="6"
                />
              </div>
              <div class="space-y-2">
                <Label for="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  v-model="passwordForm.confirmPassword"
                  type="password"
                  required
                  minlength="6"
                />
              </div>
              <div v-if="passwordError" class="text-sm text-destructive">{{ passwordError }}</div>
              <div v-if="passwordSuccess" class="text-sm text-green-600">{{ passwordSuccess }}</div>
              <Button type="submit" :disabled="changingPassword">
                {{ changingPassword ? 'Updating...' : 'Update Password' }}
              </Button>
            </form>
          </CardContent>
        </Card>

        <!-- Danger Zone Card -->
        <Card class="border-destructive">
          <CardHeader>
            <CardTitle class="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-2">
              <p class="text-sm text-gray-600">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <Button variant="destructive" @click="handleDeleteAccount"> Delete Account </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

definePageMeta({
  middleware: ['auth'],
})

const { user } = useAuth()
const { fetchWithAuth } = useApi()

const loading = ref(false)
const stats = ref({
  events: 0,
  travelPlans: 0,
  news: 0,
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordError = ref('')
const passwordSuccess = ref('')
const changingPassword = ref(false)

onMounted(async () => {
  await fetchStats()
})

const fetchStats = async () => {
  loading.value = true
  try {
    // Fetch all user's items to count them
    const [eventsRes, travelRes, newsRes] = await Promise.all([
      fetchWithAuth('/api/calendar'),
      fetchWithAuth('/api/travel'),
      fetchWithAuth('/api/news'),
    ])

    if (eventsRes.success) {
      stats.value.events = eventsRes.events.filter(
        (e: any) => e.creatorId === user.value?.id
      ).length
    }
    if (travelRes.success) {
      stats.value.travelPlans = travelRes.travelPlans.filter(
        (t: any) => t.creatorId === user.value?.id
      ).length
    }
    if (newsRes.success) {
      stats.value.news = newsRes.news.filter((n: any) => n.creatorId === user.value?.id).length
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err)
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = ''

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordError.value = 'New passwords do not match'
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return
  }

  changingPassword.value = true

  try {
    // This endpoint would need to be implemented on the backend
    const response = await fetchWithAuth('/api/auth/change-password', {
      method: 'POST',
      body: {
        currentPassword: passwordForm.value.currentPassword,
        newPassword: passwordForm.value.newPassword,
      },
    })

    if (response.success) {
      passwordSuccess.value = 'Password updated successfully!'
      passwordForm.value = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }
    }
  } catch (err: any) {
    passwordError.value = err.data?.message || 'Failed to update password'
  } finally {
    changingPassword.value = false
  }
}

const handleDeleteAccount = () => {
  const confirmed = confirm(
    'Are you absolutely sure? This action cannot be undone. All your data will be permanently deleted.'
  )

  if (confirmed) {
    const doubleCheck = confirm('Last chance! Type your password to confirm deletion.')
    if (doubleCheck) {
      alert('Account deletion feature coming soon. Contact support for account deletion.')
    }
  }
}

const formatDate = (date: string | undefined) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>
