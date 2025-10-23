<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <Card class="w-full max-w-md">
      <CardHeader>
        <CardTitle class="text-2xl text-center">Family Hub</CardTitle>
        <CardDescription class="text-center">Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="space-y-2">
            <Label for="email">Username</Label>
            <Input id="email" v-model="email" type="text" placeholder="username" required />
          </div>
          <div class="space-y-2">
            <Label for="password">Password</Label>
            <Input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>
          <div v-if="error" class="text-sm text-destructive">
            {{ error }}
          </div>
          <Button type="submit" class="w-full" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign in' }}
          </Button>
        </form>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <NuxtLink to="/register" class="text-primary hover:underline"> Register </NuxtLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

definePageMeta({
  layout: false,
})

const { login } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    const result = await login(email.value, password.value)

    if (result.success) {
      router.push('/')
    } else {
      error.value = result.message || 'Login failed'
    }
  } catch (e: any) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>
