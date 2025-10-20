<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { fetchUser, isAuthenticated } = useAuth()

// Fetch user on mount if token exists
onMounted(() => {
  if (isAuthenticated.value) {
    fetchUser()
  }
})
</script>

