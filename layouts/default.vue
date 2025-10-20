<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-xl font-bold text-primary">
              Family Hub
            </NuxtLink>
            <div class="hidden md:flex space-x-4">
              <NuxtLink
                to="/"
                class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary bg-primary/10"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/calendar"
                class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary bg-primary/10"
              >
                Calendar
              </NuxtLink>
              <NuxtLink
                to="/travel"
                class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary bg-primary/10"
              >
                Travel
              </NuxtLink>
              <NuxtLink
                to="/news"
                class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary bg-primary/10"
              >
                News
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <span v-if="user" class="text-sm text-gray-700">{{ user.name }}</span>
            <Button @click="handleLogout" variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
    <main class="container mx-auto px-4 py-8">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Button } from '~/components/ui/button'

const { user, logout } = useAuth()

const handleLogout = () => {
  logout()
}
</script>

