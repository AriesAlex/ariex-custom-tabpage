import locales from './locales'

export default defineNuxtConfig({
  modules: ['@element-plus/nuxt', '@pinia/nuxt', '@nuxtjs/i18n'],
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
  i18n: {
    lazy: true,
    langDir: 'locales',
    locales,
    defaultLocale: 'en',
    detectBrowserLanguage: false,
    strategy: 'no_prefix',
  },
})
