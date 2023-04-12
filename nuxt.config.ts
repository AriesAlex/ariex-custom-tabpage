// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      title: 'Новая вкладка',
    },
  },
  modules: ['@element-plus/nuxt', '@pinia/nuxt'],
  components: ['~/components', '~/components/Popups'],
  pinia: {
    autoImports: [
      // automatically imports `defineStore`
      'defineStore', // import { defineStore } from 'pinia'
      ['defineStore', 'definePiniaStore'], // import { defineStore as definePiniaStore } from 'pinia'
    ],
  },
  experimental: {
    inlineSSRStyles: false,
  },
})
