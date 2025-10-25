export const useAuth = () => {
  const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }) // 7 days
  const user = useState<any>('user', () => null)
  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      if (response.success && response.token) {
        token.value = response.token
        user.value = response.user
        return { success: true }
      }

      return { success: false, message: 'Login failed' }
    } catch (error: any) {
      return {
        success: false,
        message: error.data?.message || 'Login failed',
      }
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    navigateTo('/login')
  }

  const fetchUser = async () => {
    if (!token.value) return

    try {
      const response = await $fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      })

      if (response.success) {
        user.value = response.user
      }
    } catch (error) {
      // Token might be invalid
      token.value = null
      user.value = null
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    fetchUser,
  }
}
