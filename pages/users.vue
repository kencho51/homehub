<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">User Management</h1>
        <p class="text-gray-600 mt-1">Manage family hub users</p>
      </div>
      <Button @click="showCreateDialog = true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"
          />
        </svg>
        Add User
      </Button>
    </div>

    <!-- Users Table -->
    <Card>
      <CardHeader>
        <CardTitle>All Users</CardTitle>
        <CardDescription>Total users: {{ users.length }}</CardDescription>
      </CardHeader>
      <CardContent>
        <div v-if="loading" class="text-center py-8">
          <p class="text-gray-500">Loading users...</p>
        </div>

        <div v-else-if="users.length === 0" class="text-center py-8">
          <p class="text-gray-500">No users found</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-4 font-medium">Name</th>
                <th class="text-left py-3 px-4 font-medium">Username</th>
                <th class="text-left py-3 px-4 font-medium">Role</th>
                <th class="text-left py-3 px-4 font-medium">Created</th>
                <th class="text-right py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="userItem in users" :key="userItem.id" class="border-b hover:bg-gray-50">
                <td class="py-3 px-4">{{ userItem.name }}</td>
                <td class="py-3 px-4 font-mono text-sm">{{ userItem.email }}</td>
                <td class="py-3 px-4">
                  <span
                    :class="
                      userItem.role === 'admin'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    "
                    class="px-2 py-1 rounded text-xs font-medium"
                  >
                    {{ userItem.role }}
                  </span>
                </td>
                <td class="py-3 px-4 text-sm text-gray-600">
                  {{ new Date(userItem.createdAt).toLocaleDateString() }}
                </td>
                <td class="py-3 px-4 text-right space-x-2">
                  <Button @click="editUser(userItem)" variant="outline" size="sm">Edit</Button>
                  <Button
                    @click="confirmDelete(userItem)"
                    variant="destructive"
                    size="sm"
                    :disabled="userItem.id === currentUser?.id"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Create/Edit User Dialog -->
    <div
      v-if="showCreateDialog || showEditDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="closeDialogs"
    >
      <Card class="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>{{ showEditDialog ? 'Edit User' : 'Create New User' }}</CardTitle>
          <CardDescription>
            {{ showEditDialog ? 'Update user information' : 'Add a new user to the family hub' }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            @submit.prevent="showEditDialog ? handleUpdate() : handleCreate()"
            class="space-y-4"
          >
            <div class="space-y-2">
              <Label for="name">Name</Label>
              <Input id="name" v-model="formData.name" placeholder="John Doe" required />
            </div>

            <div class="space-y-2">
              <Label for="username">Username</Label>
              <Input id="username" v-model="formData.email" placeholder="john" required />
            </div>

            <div class="space-y-2">
              <Label for="password">{{
                showEditDialog ? 'Password (leave blank to keep current)' : 'Password'
              }}</Label>
              <Input
                id="password"
                v-model="formData.password"
                type="password"
                placeholder="••••••••"
                :required="!showEditDialog"
              />
            </div>

            <div class="space-y-2">
              <Label for="role">Role</Label>
              <select
                id="role"
                v-model="formData.role"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div v-if="error" class="text-sm text-destructive">
              {{ error }}
            </div>

            <div class="flex justify-end space-x-2 pt-4">
              <Button type="button" @click="closeDialogs" variant="outline">Cancel</Button>
              <Button type="submit" :disabled="submitting">
                {{
                  submitting
                    ? showEditDialog
                      ? 'Updating...'
                      : 'Creating...'
                    : showEditDialog
                      ? 'Update'
                      : 'Create'
                }}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>

    <!-- Delete Confirmation Dialog -->
    <div
      v-if="showDeleteDialog"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="showDeleteDialog = false"
    >
      <Card class="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Delete User</CardTitle>
          <CardDescription>Are you sure you want to delete this user?</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="mb-4">
            User: <strong>{{ userToDelete?.name }}</strong> ({{ userToDelete?.email }})
          </p>
          <p class="text-sm text-destructive mb-4">
            This action cannot be undone. All content created by this user will also be deleted.
          </p>

          <div v-if="error" class="text-sm text-destructive mb-4">
            {{ error }}
          </div>

          <div class="flex justify-end space-x-2">
            <Button @click="showDeleteDialog = false" variant="outline">Cancel</Button>
            <Button @click="handleDelete" variant="destructive" :disabled="submitting">
              {{ submitting ? 'Deleting...' : 'Delete User' }}
            </Button>
          </div>
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
  middleware: 'auth',
})

const { user: currentUser } = useAuth()
const { apiCall } = useApi()

const users = ref<any[]>([])
const loading = ref(true)
const error = ref('')
const submitting = ref(false)

const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showDeleteDialog = ref(false)

const formData = ref({
  name: '',
  email: '',
  password: '',
  role: 'member',
})

const editingUser = ref<any>(null)
const userToDelete = ref<any>(null)

// Check if current user is admin
onMounted(async () => {
  if (currentUser.value?.role !== 'admin') {
    navigateTo('/')
    return
  }

  await fetchUsers()
})

const fetchUsers = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await apiCall('/api/users')
    if (response.success) {
      users.value = response.users
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to fetch users'
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  error.value = ''
  submitting.value = true

  try {
    const response = await apiCall('/api/users', {
      method: 'POST',
      body: {
        name: formData.value.name,
        email: formData.value.email,
        password: formData.value.password,
        role: formData.value.role,
      },
    })

    if (response.success) {
      await fetchUsers()
      closeDialogs()
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to create user'
  } finally {
    submitting.value = false
  }
}

const editUser = (userItem: any) => {
  editingUser.value = userItem
  formData.value = {
    name: userItem.name,
    email: userItem.email,
    password: '',
    role: userItem.role,
  }
  showEditDialog.value = true
}

const handleUpdate = async () => {
  if (!editingUser.value) return

  error.value = ''
  submitting.value = true

  try {
    const updateData: any = {
      name: formData.value.name,
      email: formData.value.email,
      role: formData.value.role,
    }

    // Only include password if it's been set
    if (formData.value.password) {
      updateData.password = formData.value.password
    }

    const response = await apiCall(`/api/users/${editingUser.value.id}`, {
      method: 'PUT',
      body: updateData,
    })

    if (response.success) {
      await fetchUsers()
      closeDialogs()
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to update user'
  } finally {
    submitting.value = false
  }
}

const confirmDelete = (userItem: any) => {
  userToDelete.value = userItem
  showDeleteDialog.value = true
}

const handleDelete = async () => {
  if (!userToDelete.value) return

  error.value = ''
  submitting.value = true

  try {
    const response = await apiCall(`/api/users/${userToDelete.value.id}`, {
      method: 'DELETE',
    })

    if (response.success) {
      await fetchUsers()
      showDeleteDialog.value = false
      userToDelete.value = null
    }
  } catch (e: any) {
    error.value = e.data?.message || 'Failed to delete user'
  } finally {
    submitting.value = false
  }
}

const closeDialogs = () => {
  showCreateDialog.value = false
  showEditDialog.value = false
  editingUser.value = null
  formData.value = {
    name: '',
    email: '',
    password: '',
    role: 'member',
  }
  error.value = ''
}
</script>
