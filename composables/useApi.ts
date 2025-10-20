export const useApi = () => {
  const { token } = useAuth()

  const fetchWithAuth = async (url: string, options: any = {}) => {
    return await $fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token.value}`
      }
    })
  }

  return {
    fetchWithAuth
  }
}

