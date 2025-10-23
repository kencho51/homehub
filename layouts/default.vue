<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-white shadow-sm border-b">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-8">
            <NuxtLink to="/" class="text-xl font-bold text-primary"> Family Hub </NuxtLink>
            <div class="hidden md:flex space-x-4">
              <NuxtLink
                to="/"
                class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary bg-primary/10"
              >
                Dashboard
              </NuxtLink>
              <NuxtLink
                to="/travel"
                class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary bg-primary/10"
              >
                Travel Planner
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
            <NuxtLink
              to="/profile"
              class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2"
              active-class="text-primary bg-primary/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clip-rule="evenodd"
                />
              </svg>
              <span v-if="user" class="text-sm">{{ user.name }}</span>
            </NuxtLink>
            <Button @click="handleLogout" variant="outline" size="sm"> Logout </Button>
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
