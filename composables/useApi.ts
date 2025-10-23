export const useApi = () => {
  const { token } = useAuth()

  const apiCall = async (url: string, options: any = {}) => {
    return await $fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token.value}`,
      },
    })
  }

  // Alias for backward compatibility
  const fetchWithAuth = apiCall

  return {
    apiCall,
    fetchWithAuth,
  }
}
