// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  modules: [
    '@nuxtjs/tailwindcss',
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Family Hub',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'A family hub for calendar, travel planning, and news' }
      ],
    }
  },

  runtimeConfig: {
    // Private keys (server-only)
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    
    // Public keys (exposed to client)
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api'
    }
  },

  nitro: {
    preset: 'cloudflare-pages',
    experimental: {
      wasm: true
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  }
})

