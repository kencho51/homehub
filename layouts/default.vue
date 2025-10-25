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
              <NuxtLink
                v-if="user?.role === 'admin'"
                to="/users"
                class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                active-class="text-primary bg-primary/10"
              >
                Users
              </NuxtLink>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <NuxtLink
              to="/profile"
              class="hidden md:flex text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium items-center gap-2"
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
            <Button @click="handleLogout" variant="outline" size="sm" class="hidden md:inline-flex">
              Logout
            </Button>
            <!-- Mobile menu button -->
            <button
              @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden text-gray-700 hover:text-primary p-2"
              aria-label="Toggle menu"
            >
              <svg
                v-if="!mobileMenuOpen"
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                v-else
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
        <!-- Mobile menu -->
        <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t">
          <div class="flex flex-col space-y-2">
            <NuxtLink
              to="/"
              @click="mobileMenuOpen = false"
              class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-primary bg-primary/10"
            >
              Dashboard
            </NuxtLink>
            <NuxtLink
              to="/travel"
              @click="mobileMenuOpen = false"
              class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-primary bg-primary/10"
            >
              Travel Planner
            </NuxtLink>
            <NuxtLink
              to="/news"
              @click="mobileMenuOpen = false"
              class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-primary bg-primary/10"
            >
              News
            </NuxtLink>
            <NuxtLink
              v-if="user?.role === 'admin'"
              to="/users"
              @click="mobileMenuOpen = false"
              class="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
              active-class="text-primary bg-primary/10"
            >
              Users
            </NuxtLink>
            <NuxtLink
              to="/profile"
              @click="mobileMenuOpen = false"
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
              <span v-if="user">{{ user.name }}</span>
            </NuxtLink>
            <Button @click="handleLogout" variant="outline" size="sm" class="w-full justify-center">
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
const mobileMenuOpen = ref(false)

const handleLogout = () => {
  logout()
}
</script>
